import { useEffect, useMemo, useRef, useState } from 'react';

import { ListAlbums } from '../elements/ListAlbums.element';
import { AddPhotoModal } from '../elements/AddPhoto.element';
import { usePhotoMetaData } from '../../hooks/usePhotosData.hook';
import { useAlbums } from '../../hooks/useAlbums.hook';
import { useDeletePhoto } from '../../hooks/useDeletePhoto.hook';
import { useAddPhoto } from '../../hooks/useAddPhoto.hook';

import '../styles/dashboard.scss';

const mockData = [
  {
    id: 1,
    title: 'La première photo',
    createdAt: 'N/A',
    fileName: '00_la_première_photo.png',
    caption:
      'le texte bcp bcp bcp bcp bcp bcp bcp bcp bcp tropooooooooooooooooooooooooooooooooooooooooooooooooop long',
    albumId: 1,
    album: 'Le premier album',
  },
  {
    id: 2,
    title: 'La deuxième photo',
    createdAt: 'N/A',
    fileName: '01_la_deuxième_photo',
    caption: ' test test test',
    albumId: 1,
    album: 'Le premier album',
  },
];

export default function Dashboard() {
  //? Optimization? replace array by object for selectedPhoto
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number[]>([]);
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [isRadialOpen, setIsRadialOpen] = useState(false);
  //TODO manage if isLoading
  const { albums, isLoadingAlbum, errorAlbum } = useAlbums();
  //TODO manage error if isError and manage loading
  const { data, isError, error } = usePhotoMetaData();
  //TODO manage modale with error or success message
  const { deletePhoto, isDeleting, errorDeletePhoto, successMessage } =
    useDeletePhoto();
  const { addPhoto, isAdding, errorAddPhoto, successMessageAddPhoto } =
    useAddPhoto();
  const radialMenuRef = useRef<HTMLButtonElement | null>(null);

  //If radial menu is open, add event listener to close it on click
  useEffect(() => {
    if (!isRadialOpen) {
      return;
    }
    const handleClick = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        !radialMenuRef.current?.contains(e.target)
      ) {
        setIsRadialOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isRadialOpen]);

  //Memorize listed photo based on selected album
  const listedPhoto = useMemo(() => {
    if (!mockData) {
      return [];
    } else {
      return selectedAlbum
        ? mockData.filter((photo) => photo.albumId === selectedAlbum)
        : mockData;
    }
  }, [mockData, selectedAlbum]);

  const handleSelectAlbum = (key: number | null) => {
    setSelectedAlbum(key);
  };

  //Manage selected photo : If element(s) already exist in seletedPhoto remove it, else add it
  const handleSelectPhoto = (photoId: number | null) => {
    if (!photoId) {
      if (
        selectedPhoto.length === listedPhoto.length &&
        selectedPhoto.length > 0
      ) {
        setSelectedPhoto([]);
      } else {
        setSelectedPhoto(listedPhoto.map((photo) => photo.id));
      }
    } else {
      if (selectedPhoto.includes(photoId)) {
        setSelectedPhoto(selectedPhoto.filter((photo) => photo !== photoId));
      } else {
        setSelectedPhoto([...selectedPhoto, photoId]);
      }
    }
  };

  // Call fetch function to delete photo
  const handleDeletePhoto = async () => {
    if (selectedPhoto.length === 0) {
      return;
    }
    await deletePhoto(selectedPhoto);
    setSelectedPhoto([]);
  };

  //Create table with all photo metadata
  const listPhotos = () => {
    return listedPhoto.map((photo) => (
      <tr className="table__row" key={photo.id}>
        <td className="table__column">{photo.fileName}</td>
        <td className="table__column">{photo.title}</td>
        <td className="table__column">{photo.caption}</td>
        <td className="table__column">{photo.album}</td>
        <td className="table__column">{photo.createdAt}</td>
        <td className="table__column">
          <button className="table__edit">Editer</button>
        </td>
        <td className="table__column">
          <input
            className="table__checkbox"
            type="checkbox"
            checked={selectedPhoto.includes(photo.id)}
            onChange={() => {
              handleSelectPhoto(photo.id);
            }}
          />
        </td>
      </tr>
    ));
  };

  return (
    <section className="container">
      {isAddPhotoModalOpen && (
        <AddPhotoModal
          onClose={() => setIsAddPhotoModalOpen(false)}
          onSubmit={addPhoto}
        />
      )}
      <nav className="nav">
        <ul>
          <li
            className="nav__item"
            onClick={() => {
              handleSelectAlbum(null);
            }}
          >
            Accueil
          </li>
          <ListAlbums
            albums={albums}
            error={errorAlbum}
            onSelect={handleSelectAlbum}
          />
        </ul>
      </nav>
      <section className="main">
        {isRadialOpen &&
          (selectedAlbum ? (
            <ul className="main__radial">
              <li className="radial__item">
                <button>Retirer de l'album</button>
              </li>
            </ul>
          ) : (
            <ul className="main__radial">
              <li className="radial__item">
                <button>Ajouter à un album</button>
              </li>
              <li>
                <button
                  className="radial__button"
                  disabled={isDeleting}
                  onClick={() => {
                    handleDeletePhoto();
                  }}
                >
                  Supprimer
                </button>
              </li>
            </ul>
          ))}
        <header className="main__header">
          <button
            className="header__addButton"
            onMouseDown={() => setIsAddPhotoModalOpen(true)}
          >
            +
          </button>
        </header>
        <table className="main__table">
          <thead className="table__head">
            <tr className="table__row head__row">
              <th className="table__column">Fichier</th>
              <th className="table__column">Titre</th>
              <th className="table__column">Légende</th>
              <th className="table__column">Album</th>
              <th className="table__column">Ajouté</th>
              <th className="table__column">
                <button
                  className="table__radialButton"
                  ref={radialMenuRef}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsRadialOpen(true);
                  }}
                >
                  <div className="radialButton__point"></div>
                  <div className="radialButton__point"></div>
                  <div className="radialButton__point"></div>
                </button>
              </th>
              <th className="table__column">
                <input
                  className="table__checkbox"
                  type="checkbox"
                  checked={selectedPhoto.length === listedPhoto.length}
                  onChange={() => {
                    handleSelectPhoto(null);
                  }}
                />
              </th>
            </tr>
          </thead>
          <tbody className="table__body">{listPhotos()}</tbody>
        </table>
      </section>
    </section>
  );
}

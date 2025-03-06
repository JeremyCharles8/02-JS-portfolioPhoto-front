import { useState } from 'react';

import { usePhotoMetaData } from '../../hooks/usePhotosData.hook';
import { useAlbums } from '../../hooks/useAlbums.hook';
import { ListAlbums } from '../elements/ListAlbums.element';

export default function Dashboard() {
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const { albums, loadingAlbum, errorAlbum } = useAlbums();
  const { data, isError, error } = usePhotoMetaData();
  //TODO manage error if isError and manage loading

  const handleSelectAlbum = (key: number) => {
    setSelectedAlbum(key);
  };

  //Create table with all photo metadata
  const listPhotos = () => {
    if (data) {
      let photoToList;
      if (selectedAlbum) {
        photoToList = data.filter((item) => item.albumId === selectedAlbum);
      } else {
        photoToList = data;
      }

      return photoToList.map((item) => (
        <tr className="table__body--row" key={item.id}>
          <td className="table__body--column">{item.fileName}</td>
          <td className="table__body--column">{item.title}</td>
          <td className="table__body--column">{item.caption}</td>
          <td className="table__body--column">{item.album}</td>
          <td className="table__body--column">{item.createdAt}</td>
          <td className="table__body--column"></td>
        </tr>
      ));
    }
  };

  return (
    <section className="container">
      <nav className="nav">
        <ul>
          <ListAlbums
            albums={albums}
            error={errorAlbum}
            onSelect={handleSelectAlbum}
          />
        </ul>
      </nav>
      <section className="main">
        <table className="main__table">
          <thead className="table__head">
            <tr className="table__head--row">
              <th className="table__head--column">Fichier</th>
              <th className="table__head--column">Titre</th>
              <th className="table__head--column">Légende</th>
              <th className="table__head--column">album</th>
              <th className="table__head--column">Ajouté</th>
              <th className="table__head--column"></th>
            </tr>
          </thead>
          <tbody className="table__body">{listPhotos()}</tbody>
        </table>
      </section>
    </section>
  );
}

import { useNavigate } from 'react-router-dom';
import { usePhotoMetaData } from '../hooks/usePhotosData.hook';

import { albumSchema } from '../schemas/album.schema';
import { errorSchema } from '../schemas/error.schema';

const apiUrl: string = import.meta.env.VITE_API_URL;

const getAlbums = async () => {
  try {
    const response = await fetch(`${apiUrl}/albums/`, {
      method: 'GET',
      headers: {
        credentials: 'include',
      },
    });
    if (!response.ok) {
      const errorData = errorSchema.parse(await response.json());
      return { status: response.status, error: errorData.error, data: null };
    }

    const data = albumSchema.parse(await response.json());

    return { status: response.status, error: null, data };
  } catch (error) {
    console.log(error);
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isError, error } = usePhotoMetaData();

  //TODO manage error if isError and manage loading

  //Create list with all album name
  const listAlbums = async () => {
    const albums = await getAlbums();

    if (albums && albums.error) {
      if (albums.status === 404) {
        return <p className="nav__error">Ressource introuvable</p>;
      }
      if (albums.status === 500) {
        return (
          <p className="nav__error">
            Une erreur est survenu côté serveur, si le problème persiste
            veuillez contacter l'administrateur
          </p>
        );
      }
      if (albums.status === 401) {
        navigate('/auth');
      }
    }

    if (albums && albums.data) {
      return albums.data.map((item) => (
        <li className="nav__item" key={item.id}>
          {item.title}
        </li>
      ));
    }
  };

  //Create talble with all photo metadata
  const listPhotos = () => {
    if (data) {
      return data.map((item) => (
        <tr className="table__body--row">
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
        <ul className="nav__list">{listAlbums()}</ul>
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

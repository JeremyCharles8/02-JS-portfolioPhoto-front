import { AlbumList } from '../../@types/album.type';

type PropType = {
  albums: AlbumList | [];
  error: number | null;
  onSelect: (id: number) => void;
};

//Create list with all albums names
export function ListAlbums({ albums, error, onSelect }: PropType) {
  if (error && error === 500) {
    <p>
      Une erreur c'est produite côté serveur, si le problème persiste veuillez
      contacter l'administrateur
    </p>;
  } else {
    return albums.map((item) => (
      <li
        className="nav__item"
        key={item.id}
        onClick={() => {
          onSelect(item.id);
        }}
      >
        {item.title}
      </li>
    ));
  }
}

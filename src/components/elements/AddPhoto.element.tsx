import { useState } from 'react';
import { createPortal } from 'react-dom';

import { AddPhoto } from '../../@types/photo.type';

type PropType = {
  onSubmit: (formData: AddPhoto) => void;
  onClose: () => void;
};

export function AddPhotoModal({ onSubmit, onClose }: PropType) {
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    file: null,
  });

  //Fill formData with user input
  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //Call function to fetch data, reset formData and close modal
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      caption: '',
      file: null,
    });
    onClose();
  };

  const modalRoot = document.getElementById('modal-root');

  return modalRoot
    ? createPortal(
        <section>
          <form action="">
            <input
              type="text"
              name="title"
              placeholder="Titre"
              onChange={handleChange}
            />
            <input
              type="text"
              name="caption"
              placeholder="Description"
              onChange={handleChange}
            />
            <input type="file" name="file" />
            <button type="submit" onClick={handleSubmit}>
              Enregistrer
            </button>
          </form>
        </section>,
        modalRoot
      )
    : null;
}

import React, { useState, useEffect } from "react";
import Buffer from "buffer";
import axios from "axios";

function App() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    imageFile: null,
  });

  useEffect(() => {
    // Remplacez l'URL par l'endpoint de votre serveur pour récupérer les données des images
    axios
      .get("http://localhost:5000")
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des images :", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleAddImage = async (e) => {
    e.preventDefault();

    // Créez un objet FormData pour envoyer le fichier
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("testImage", formData.imageFile);

    try {
      const response = await axios.post(
        "http://localhost:5000",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Image ajoutée avec succès", response.data);

      // Mettez à jour la liste des images avec la nouvelle image ajoutée
      setImages([...images, response.data]);

      // Réinitialisez le formulaire
      setFormData({
        name: "",
        title: "",
        description: "",
        imageFile: null,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'image :", error);
    }
  };

  return (
    <div className="App">
      <h1>Images enregistrées</h1>
      <div className="image-container">
        {images.map((image, index) => (
          <div key={index} className="image-card">
            <img
              src={`data:${image.img.contentType};base64,${Buffer.from(
                image.img.data.data
              ).toString("base64")}`}
              alt={"image téléchargée: " + image.name}
            />
            <p>{image.name}</p>
            <p>{image.title}</p>
            <p>{image.description}</p>
          </div>
        ))}
      </div>
      <h2>Ajouter une nouvelle image</h2>
      <form onSubmit={handleAddImage} encType="multipart/form-data">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Titre"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input type="file" name="testImage" onChange={handleFileChange} />
        </div>
        <div>
          <button type="submit">Ajouter</button>
        </div>
      </form>
    </div>
  );
}

export default App;

import { useState } from "react";
import { grey } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Link,
  Alert,
} from "@mui/material";

function UploadImages({ title, images, setImages, max, maxSize = 5 }) {
  const [alert, setAlert] = useState({ show: false, message: "" });
  const idInput = uuidv4();

  const handleImageUpload = (e) => {
    const actualUploaded = images.filter((image) => image.image?.url).length;

    if (actualUploaded + e.target?.files.length > max) {
      e.preventDefault();
      setAlert({
        show: true,
        message: `No puede subir mas de ${max} ${
          max === 1 ? "imágen" : "imágenes"
        }`,
      });
      return;
    }

    const tempArr = [];
    [...e.target?.files].forEach((file) => {
      if (parseFloat(file.size / Math.pow(1024, 2)) > maxSize) {
        setAlert({
          show: true,
          message: `Las imágenes deben tener un tamaño máximo de  ${maxSize} MB`,
        });
        return;
      }
      tempArr.push({
        image: {
          file: file,
          url: URL.createObjectURL(file),
        },
      });
    });

    if (tempArr.length > 0) setImages((previous) => [...previous, ...tempArr]);

    // Delete value storaged in input component
    e.target.value = null;
  };

  const deleteImage = (index) => {
    // const filtered = images.filter((item, index) => index !== e);

    if (images[index]?.image?.file) {
      images.splice(index, 1);
    } else {
      images[index] = {
        image: {
          updated: images[index]?.image,
        },
      };
    }

    setImages([...images]);
  };

  return (
    <>
      <Box sx={{ border: "1px solid black", p: 3, borderColor: grey[300] }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {images?.length > 0 &&
          images.map(
            (i, index) =>
              i.image?.url && (
                <Box key={index} sx={{ my: 2 }}>
                  <Card
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      "&:hover": {
                        backgroundColor: "#E4E4E4",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Link href={i.image?.url} target="_blank" rel="noopener">
                        <CardMedia
                          component="img"
                          sx={{ width: 80, height: 80, p: 1 }}
                          image={i.image?.url}
                          alt={i.image?.file?.name}
                        />
                      </Link>
                      <span>{i.image?.file?.name}</span>
                    </Box>

                    <CardContent>
                      <IconButton
                        onClick={() => deleteImage(index)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Box>
              )
          )}
        <label htmlFor={idInput}>
          <input
            id={idInput}
            name={idInput}
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple
          />
          <Button variant="outlined" component="span" fullWidth>
            Subir imagenes
          </Button>
        </label>

        {alert.show && (
          <Alert
            onClose={() => setAlert(false)}
            sx={{ mt: 2 }}
            severity="error"
          >
            {alert.message}
          </Alert>
        )}
      </Box>
    </>
  );
}

export default UploadImages;

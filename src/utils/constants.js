export const urlApi = "http://localhost:8080";

export const validationErrors = {
  login: {
    email: {
      max: "La longitud máxima permitida de 75 caracteres.",
      required: "El email es requerido.",
    },
    password: {
      max: "La longitud máxima permitida de 50 caracteres.",
      required: "la contraseña es requerida.",
    },
  },

  user: {
    idCard: {
      required: "La cédula es requerida.",
      max: "La longitud máxima es de 15 caracteres.",
    },
    username: {
      required: "El usuario es requerido.",
      min: "La longitud mínima es de 5 caracteres.",
      max: "La longitud máxima es de 75 caracteres.",
    },
    fullName: {
      required: "El nombre es requerido.",
      min: "La longitud mínima es de 5 caracteres.",
      max: "La longitud máxima es de 100 caracteres.",
    },
    phone: {
      max: "La longitud máxima es de 15 caracteres.",
      valid: "Solo puede ingresar números.",
    },
    email: {
      required: "El email es requerido.",
      max: "La longitud máxima es de 50 caracteres.",
      valid: "Ingrese un email valido.",
    },
    password: {
      required: "La contraseña es requerida.",
      min: "La longitud mínima es de 5 caracteres.",
      max: "La longitud máxima es de 50 caracteres.",
    },
    role: { required: "Debe seleccionar el rol." },
    urbanization: { required: "Debe seleccionar la urbanización." },
    family: { required: "Debe seleccionar la familia." },
  },

  family: {
    code: {
      required: "El código es requerido.",
      max: "La longitud máxima es de 25 caracteres.",
    },
    name: {
      required: "El nombre es requerido.",
      max: "La longitud máxima es de 75 caracteres.",
    },
    address: {
      required: "La dirección es requerida.",
      max: "La longitud máxima es de 100 caracteres.",
    },
    aliquot: {
      required: "El valor de la alicuota es requerida",
    },
  },

  urbanization: {
    code: {
      required: "El código es requerido.",
      max: "La longitud máxima es de 25 caracteres.",
    },
    name: {
      required: "El nombre es requerido.",
      max: "La longitud máxima es de 75 caracteres.",
    },
    address: {
      required: "La dirección es requerida.",
      max: "La longitud máxima es de 100 caracteres.",
    },
  },
};

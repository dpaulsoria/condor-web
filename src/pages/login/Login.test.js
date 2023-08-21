import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

describe("Login component", () => {
  test("submits form with valid data", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText("Usuario"), "condoradmin");
    userEvent.type(screen.getByLabelText("Contraseña"), "condorcondor");

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Realizar las comprobaciones necesarias

    // Ejemplo de comprobación: verificar que se muestre un mensaje de éxito
    // Utilizar una función de coincidencia personalizada
  const successMessage = screen.getByText((content, element) => {
    // Verificar si el contenido del elemento coincide con el texto deseado
    const normalizedContent = content.replace(/\s+/g, " ").trim();
    return normalizedContent === "Iniciando sesión...";
  });

  expect(successMessage).toBeInTheDocument();
  });

  test("shows error message with invalid data", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText("Usuario"), "");
    userEvent.type(screen.getByLabelText("Contraseña"), "");

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByText("El campo 'Usuario' es requerido.")).toBeInTheDocument();
  });

  // Resto de las pruebas...

});

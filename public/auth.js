// Front-end JS code for authentication
const errorMessage = document.getElementById("FormError");

const loginUser = async (event) => {
  try {
    event.preventDefault(); // Prevent the page from reloading;
    const formData = new FormData(event.target);
    const formDataAsObject = Object.fromEntries(formData.entries());
    console.log(formDataAsObject);
    await api("POST", "/auth/login", formDataAsObject);
    window.location.replace("/homepage");
  } catch (error) {
    console.log(error);
    const message = error.response?.data ?? error.message;
    errorMessage.classList.add("FormError--visible");
    errorMessage.textContent = message;
  }
};

const getSignUpDetails = async (event, target) => {
  try {
    event.preventDefault(); // Prevent the page from reloading;
    const formData = new FormData(event.target);
    const formDataAsObject = Object.fromEntries(formData.entries());
    console.log(formDataAsObject);
    if (formDataAsObject.password !== formDataAsObject.password2) {
      throw Error("Passwords do not match");
    }
    await api("POST", "/auth/signup", formDataAsObject);
    window.location.replace("/");
  } catch (error) {
    console.log(error);
    const message = error.response?.data ?? error.message;
    errorMessage.classList.add("FormError--visible");
    errorMessage.textContent = message;
  }
};

const logout = () => {
  console.log("Ik werk ");
};

document.addEventListener("click", () =>
  errorMessage.classList.remove("FormError--visible")
);

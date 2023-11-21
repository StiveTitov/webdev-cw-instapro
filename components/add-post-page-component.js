import { renderHeaderComponent } from "./header-component.js";
import { addPostsUser } from '../api.js';
import { posts, goToPage, getToken } from "../index.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { sanitizeHtml } from "./sanitizeHtml.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <h3 class="form-title">Добавить пост</h3>
      <div class="upload-image-container">
          <div class="upload=image">
            <label class="file-upload-label secondary-button">
                <input type="file" class="file-upload-input" style="display:none">
                Выберите фото
            </label>
          </div>
      </div>
          <div>
          <p>Опишите фотографию:</p>
                <div class ="form">
                    <div class="form-inputs">
                        <textarea type="textarea" id="img-description" class="img-description" rows="4"></textarea>

                        <button class="button" id="add-button">Добавить</button>
                    </div>
                </div>
          </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      let fotoDescription = document.getElementById("img-description").value;
      let imgData= imageUrl;
      if (!imgData) {
        alert("Необходимо добавить фото");
        return;
      }
      if (!fotoDescription) {
        alert("Необходимо добавить описание фотографии");
        return;
      }
      onAddPostClick({
        description: sanitizeHtml(fotoDescription),
        imageUrl: imageUrl,
      });
      addPostsUser({
        token: getToken(),
        description: sanitizeHtml(fotoDescription),
        imageUrl: imageUrl,
      })
        //.then((user) => {
        //  setUser(user.user);
        //})
        .catch((error) => {
          console.warn(error);
          setError(error.message);
        });
    });
  };

  render();

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}

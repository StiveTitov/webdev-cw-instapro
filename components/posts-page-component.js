import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, setPosts, getToken, renderApp } from "../index.js";
import { addLike, disLike, getPosts } from '../api.js';
import { formatDistanceToNow } from "date-fns";

export let postId;

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api

 console.log("Актуальный список постов:", posts);
 

 

 



  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  
  const appPosts = posts.map((post) => {
    return {
      userImageUrl: post.user.imageUrl,
      userName: post.user.name,
      userId: post.user.id,
      imageUrl: post.imageUrl,
      description: post.description,
      userLogin: post.user.login,
      //date: formatDistanceToNow(new Date(post.createdAt), { locale: ru }),
      likes: post.likes,
      isLiked: post.isLiked,
      id: post.id,
    }
  })
  
  const postsHtml = appPosts.map((element, index) => {
    return `
      <div class="page-container">
        <div class="header-container"></div>
        <ul class="posts">
          <li class="post" data-index=${index}>
            <div class="post-header" data-user-id="${element.userId}">
                <img src="${element.userImageUrl}" class="post-header__user-image">
                <p class="post-header__user-name">${element.userName}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" src="${element.imageUrl}">
            </div>
            <div class="post-likes">
              <button data-post-id="${element.id}" data-like="${element.isLiked ? 'true' : ''}" data-index="${index}" class="like-button">
                <img src="${element.isLiked ? `./assets/images/like-active.svg` : `./assets/images/like-not-active.svg`}">
              </button>
              <p class="post-likes-text">
              Нравится: <strong>${element.likes.length >= 1 ? element.likes[0].name : '0'}</strong> ${(element.likes.length - 1) > 0 ? 'и ещё' + ' ' + (element.likes.length - 1) : ''}
              </p >
            </div >
            <p class="post-text">
              <span class="user-name">${element.userName}</span>
              ${element.description}
            </p>
            <p class="post-date">
              ${element.date} назад
            </p>
          </li >                  
        </ul >
      </div > `
  });

  appEl.innerHTML = postsHtml;

  

  //// Доработать функционал лайков

  const likeEventListener = () => {
    const likeButtons = document.querySelectorAll(".like-button");

    likeButtons.forEach(likeButton => {
      likeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        postId = likeButton.dataset.postId;
        
        const index = likeButton.dataset.index;
        likeButton.classList.add("shake-bottom");

        if (posts[index].isLiked) {
          
          disLike({ token: getToken(), postId })
            .then(() => {
              posts[index].isLiked = false;
            })
            .then(() => {
              getPosts({ token: getToken() })
                .then((response) => {
                  setPosts(response);
                  likeButton.classList.remove("shake-bottom");
                  renderApp();
                })
            })
        } else {
          
          addLike({ token: getToken(), postId })
            .then(() => {
              posts[index].isLiked = true;
            })
            .then(() => {
              getPosts({ token: getToken() })
                .then((response) => {
                  setPosts(response);
                  likeButton.classList.remove("shake-bottom");
                  renderApp();
                })
            })
        }
      });
    });
  };

  likeEventListener();

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

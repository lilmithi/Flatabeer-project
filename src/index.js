// Code here
document.addEventListener("DOMContentLoaded", () => {
  const ul = document.getElementById("beer-list");
  const h2 = document.getElementById("beer-name");
  const img = document.getElementById("beer-image");
  const em = document.getElementById("beer-description");
  const reviewForm = document.getElementById("review-form");
  const descriptionForm = document.getElementById("description-form");

  fetch("http://localhost:3000/beers/1")
    .then((resp) => resp.json())
    .then((obj) => {
      h2.textContent = obj.name;
      img.src = obj.image_url;
      em.textContent = obj.description;
      obj.reviews.forEach((review) => {
        const reviewUl = document.getElementById("review-list");
        const li = document.createElement("li");
        li.append(review);
        reviewUl.appendChild(li);
      });
      descriptionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        fetch(`http://localhost:3000/beers/1`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            description: e.target.description.value,
          }),
        })
          .then((resp) => resp.json())
          .then((desContent) => {
            em.textContent = desContent.description;
          });
      });
      reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        fetch("http://localhost:3000/beers/1", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            reviews: `${obj.reviews},${e.target.review.value}`.split(","),
          }),
        })
          .then((resp) => resp.json())
          .then((desc) => {
            desc.reviews.forEach((review) => {
              const reviewUl = document.getElementById("review-list");
              reviewUl.textContent = "";
              const li = document.createElement("li");
              li.append(review);
              reviewUl.appendChild(li);
            });
          });
      });
    })
    .catch(() => alert("Fetch Error!!"));
  fetch("http://localhost:3000/beers")
    .then((resp) => resp.json())
    .then((obj) => {
      obj.forEach((myObj) => {
        const nameLi = document.createElement("li");
        nameLi.className = "beerName";
        nameLi.append(myObj.name);
        ul.appendChild(nameLi);
      });
      ul.childNodes.forEach((beer) => {
        beer.addEventListener("click", () => {
          fetch("http://localhost:3000/beers")
            .then((resp) => resp.json())
            .then((myObj) => {
              for (const innerObj of myObj) {
                if (innerObj.name === beer.textContent) {
                  fetch(`http://localhost:3000/beers/${innerObj.id}`)
                    .then((resp) => resp.json())
                    .then((renderObj) => {
                      h2.textContent = renderObj.name;
                      img.src = renderObj.image_url;
                      const reviewUl = document.getElementById("review-list");
                      reviewUl.textContent = "";
                      renderObj.reviews.forEach((review) => {
                        const li = document.createElement("li");
                        li.append(review);
                        reviewUl.appendChild(li);
                      });

                      em.textContent = renderObj.description;

                      descriptionForm.addEventListener("submit", (e) => {
                        e.preventDefault();
                        fetch(`http://localhost:3000/beers/${innerObj.id}`, {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                          },
                          body: JSON.stringify({
                            description: e.target.description.value,
                          }),
                        })
                          .then((resp) => resp.json())
                          .then((desContent) => {
                            em.textContent = desContent.description;
                          })
                          .catch(() => alert("Submit Error!"));
                      });
                    })
                    .catch(() => alert("Fetch Error!"));
                  reviewForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    fetch(`http://localhost:3000/beers/${innerObj.id}`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify({
                        reviews:
                          `${innerObj.reviews},${e.target.review.value}`.split(
                            ","
                          ),
                      }),
                    })
                      .then((resp) => resp.json())
                      .then((desc) => {
                        desc.reviews.forEach((review) => {
                          const reviewUl =
                            document.getElementById("review-list");
                          reviewUl.textContent = "";
                          const li = document.createElement("li");
                          li.append(review);
                          reviewUl.textContent = li;
                          reviewUl.appendChild(li);
                        });
                      })
                      .catch(() => alert("Submit Error!"));
                  });
                }
              }
            });
        });
      });
    });
});

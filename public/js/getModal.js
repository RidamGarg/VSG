// function numberWithCommas(x) {
//     return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
// }
//const url2 = "http://localhost:3000";
const url2 = "https://virtual-trading-1.herokuapp.com";
const shareModal = document.getElementById("shareModal");

shareModal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;
  const title = button.getAttribute("data-bs-content");
  const className = button.getAttribute("data-bs-class");
  const buttonName = button.getAttribute("data-bs-button");
  const modalBodyForm = shareModal.querySelector("form");
  const modalTitle = shareModal.querySelector(".modal-title");
  const modalBodyButton = shareModal.querySelector("form #change");
  modalTitle.textContent = title;
  modalBodyButton.className = className;
  modalBodyButton.textContent = buttonName;
  const href = button.getAttribute("data-bs-href");
  modalBodyForm.action = `${url2}/${href}`;
});

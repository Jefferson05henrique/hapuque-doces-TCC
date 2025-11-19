function filtrarCardapio() {
  const termoBusca = document.getElementById("campoBusca").value.toLowerCase();
  const itensCardapio = document.querySelectorAll(".doce");

  itensCardapio.forEach((item) => {
    const textoDoItem = item.textContent.toLowerCase();

    if (textoDoItem.includes(termoBusca)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

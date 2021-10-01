const d = document;
const $shows = d.querySelector("#shows");
const $input = d.querySelector("#search");
const $template = d.querySelector("#show-template").content;
const $fragment = d.createDocumentFragment();

d.addEventListener("keypress", async (e) => {
  if (e.target === $input) {
    if (e.key === "Enter") {
      try {
        $shows.innerHTML = `<img class="loader" src="bars.svg" alt="Cargando..." title="Cargando...">`;

        let input = $input.value.toLowerCase();
        let api = `https://api.tvmaze.com/search/shows?q=${input}`;
        let res = await fetch(api);
        let json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        if (json.length < 1)
          $shows.innerHTML = `
       <p>Parece ser que no hay shows sobre eso, ¿estás seguro que es: 
       <mark>${input}</mark>?
       </p>
       `;
        else {
          json.forEach((el) => {
            $template.querySelector("h3").textContent = el.show.name;
            $template.querySelector("div").innerHTML = el.show.summary ? el.show.summary : "Sin resumen";
            $template.querySelector("img").setAttribute("src",el.show.image?el.show.image.medium :"http://static.tvmaze.com/images/no-img/no-img-portrait-text.png");
            $template.querySelector("a").setAttribute("href",el.show.officialSite ? el.show.officialSite : "#")
            $template.querySelector("a").setAttribute("target",el.show.officialSite ? "_blank": "_self")
            $template.querySelector("a").textContent = el.show.officialSite ? "Ver más": ""
            let $clone = d.importNode($template,true)
            $fragment.appendChild($clone)
          });

          $shows.innerHTML = ""
          $shows.appendChild($fragment)
        }
        console.log(json);
      } catch (error) {
        let msg = error.statusText || "Ocurrió un error";
        $shows.innerHTML = `<p>${msg} ${error.status}</p>`;
      }
    }
  }
});

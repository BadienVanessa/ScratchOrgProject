// alert('bonjour');
// window.open('http://127.0.0.1:8081/scratch.html');

// Wrap every letter in a span
var textWrapper = document.querySelector('.ml2');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml2 .letter',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 950,
    delay: (el, i) => 70*i
  }).add({
    targets: '.ml2',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });


  //js boutton
const bottom = document.querySelector(".bottom");
const overlay = document.querySelector(".overlay");
const count = 110;
const size = 50;
for (let i = 0; i <= count; i += 1) {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  bottom.appendChild(dot);
}
const dots = Array.from(document.querySelectorAll(".dot"));

const updateText = (text) => {
  Array.from(document.querySelectorAll(".text")).forEach(
    (e) => (e.innerHTML = text)
  );
};

const reset = () => {
  dots.forEach((dot, i) => {
    const x = (i / count) * (190 + size) - size / 2;
    const y = Math.random(1) * 52 - size / 2;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.opacity = 1;
    dot.style.transform = "scale(1)";
  });
};
reset();

overlay.addEventListener("click", () => {
  anime({
    easing: "linear",
    targets: document.querySelectorAll(".dot"),
    opacity: [{ value: 0, duration: 600, delay: anime.stagger(10) }],
    translateX: {
      value: function () {
        return anime.random(-30, 30);
      },
      duration: 400,
      delay: anime.stagger(10)
    },
    translateY: {
      value: function () {
        return anime.random(-30, 30);
      },
      duration: 400,
      delay: anime.stagger(10)
    },
    scale: {
      value: function () {
        return 0;
      },
      duration: 400,
      delay: anime.stagger(10)
    }
  });
  anime({
    easing: "linear",
    delay: 4000,
    complete: () => {
      updateText("Created");
      setTimeout(() => {
        updateText("Create");
        reset();
      }, 3000);
    }
  });
});






// //condition to validate the form
// function validateForm() {
//   let pull_branch_name_Submit = document.forms["myForm"]["pull_branch_name"].value;
//   let org_name_Submit = document.forms["myForm"]["org_name"].value;
//   let alias_name_Submit = document.forms["myForm"]["alias_name"].value;
//   let project_Scratch_Def_Json_Submit = document.forms["myForm"]["project_Scratch_Def_Json"].value;
//   let Info_Scratch_Org_Submit = document.forms["myForm"]["Info_Scratch_Org"].value;
//   let time_Submit = document.forms["myForm"]["time"].value;

//   if (pull_branch_name_Submit == "") {
//     alert("Please enter the branch name");
//     return false;
//   }else if(org_name_Submit == "") {
//     alert("Please enter the name of your organisation");
//     return false;
//   }else if(alias_name_Submit == "") {
//     alert("Please enter the name of your scratch org");
//     return false;
//   }else if(project_Scratch_Def_Json_Submit == "" || project_Scratch_Def_Json_Submit == "./" || project_Scratch_Def_Json_Submit == "./config") {
//     alert("Please enter the good path of your file 1");
//     return false;
//   }else if(Info_Scratch_Org_Submit == "") {
//     alert("Please enter the good path of your file and a new name 2");
//     return false;
//   }else if(time_Submit == "") {
//     alert("Please enter the duration of your scratch org");
//     return false;
//   }
// }

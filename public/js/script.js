var age = document.getElementById("age");
var height = document.getElementById("height");
var weight = document.getElementById("weight");
var male = document.getElementById("m");
var female = document.getElementById("f");
var form = document.getElementById("form");
let resultArea = document.querySelector(".comment");
var modalContent = document.querySelector(".modal-content");
var modalText = document.querySelector("#modalText");
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
let resultArea1 = document.querySelector(".daily-calories");
var sedentary = document.getElementById("sedentary");
var light = document.getElementById("light");
var moderate = document.getElementById("moderate");
var veryActive = document.getElementById("very-active");
var superActive = document.getElementById("super-active");

age.addEventListener('input', (event) => {
  const inputValue = event.target.value;
  const numericValue = parseFloat(inputValue);
  if (isNaN(numericValue)) {
    event.target.value = inputValue.slice(0, -1);
  } else if (numericValue < 1 || numericValue > 120) {
    event.target.value = Math.min(Math.max(numericValue, 1), 120);
  } else {
    event.target.value = numericValue;
  }
});

height.addEventListener('input', (event) => {
  const inputValue = event.target.value;
  const numericValue = parseFloat(inputValue);
  if (isNaN(numericValue)) {
    event.target.value = inputValue.slice(0, -1);
  } else if (numericValue < 1 || numericValue > 250) {
    event.target.value = Math.min(Math.max(numericValue, 1), 250);
  } else {
    event.target.value = numericValue;
  }
});

weight.addEventListener('input', (event) => {
  const inputValue = event.target.value;
  const numericValue = parseFloat(inputValue);
  if (isNaN(numericValue)) {
    event.target.value = inputValue.slice(0, -1);
  } else if (numericValue < 1 || numericValue > 200) {
    event.target.value = Math.min(Math.max(numericValue, 1), 200);
  } else {
    event.target.value = numericValue;
  }
});

function call_p() {
  fetch('/posts')
    .then(response => response.json())
    .then(data => {
      // Update the HTML with the response data
      const postDataDiv = document.getElementById('postData');
      postDataDiv.innerHTML = `
        <p class="BMI_Result_Summary">Total count: ${data.total.count}</p>
        <p class="BMI_Result_Summary">Total average age: ${data.total.avg_age}</p>
        <p class="BMI_Result_Summary">Total average BMI: ${parseFloat(data.total.avg_bmi).toFixed(2)}</p>
        <p class="BMI_Result_Summary">Total average BMR: ${parseFloat(data.total.avg_bmr).toFixed(0)}</p>
        <p class="BMI_Result_Summary">Total average TDEE: ${parseFloat(data.total.avg_tdee).toFixed(0)}</p>
        <br>
        <h2 class="BMI_Result_Summary">Breakdown by sex:</h2><br>
        <table>
          <thead>
            <tr>
              <th>Sex</th>
              <th>Count</th>
              <th>Average age</th>
              <th>Average BMI</th>
              <th>Average BMR</th>
              <th>Average TDEE</th>
            </tr>
          </thead>
          <tbody>
            ${data.sex.map(sex => `
              <tr>
                <td>${sex.sex}</td>
                <td>${sex.count}</td>
                <td>${sex.avg_age}</td>
                <td>${parseFloat(sex.avg_bmi).toFixed(2)}</td>
                <td>${parseFloat(sex.avg_bmr).toFixed(2)}</td>
                <td>${parseFloat(sex.avg_tdee).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    })
    .catch(error => console.error('Error:', error));
}
call_p()

function calculate() {
  if (
    age.value == "" ||
    height.value == "" ||
    weight.value == "" ||
    (male.checked == false && female.checked == false)
  ) {
    modal.style.display = "block";
    modalText.innerHTML = `All fields are required!`;
  } else {
    countBmi();
  }
}

function countBmi() {
  var p = [age.value, height.value, weight.value];
  if (male.checked) {
    p.push("male");
  } else if (female.checked) {
    p.push("female");
  }

  var bmi = Number(p[2]) / (((Number(p[1]) / 100) * Number(p[1])) / 100);
  var age1 = p[0];
  var sex1 = p[3];
  var result = "";
  if (bmi < 18.5) {
    result = "Underweight";
  } else if (18.5 <= bmi && bmi <= 22.9) {
    result = "Healthy";
  } else if (23 <= bmi && bmi <= 24.9) {
    result = "Overweight";
  } else if (25 <= bmi && bmi <= 29.9) {
    result = "Obese";
  } else if (30 <= bmi) {
    result = "Extremely obese";
  }
  // calculate the initial BMR value
  bmr = 10 * Number(p[2]) + 6.25 * Number(p[1]) - 5 * Number(p[0]);

  // gender specific adjustment
  if (p[3] === "male") {
    bmr += 5;
  } else if (p[3] === "female") {
    bmr -= 161;
  }
  bmr = bmr.toFixed(0)

  var se = (bmr * 1.2);
  var l = (bmr * 1.375);
  var m = (bmr * 1.55);
  var v = (bmr * 1.725);
  var su = (bmr * 1.9);

  sedentary.innerHTML = se.toFixed(0);
  light.innerHTML = l.toFixed(0);
  moderate.innerHTML = m.toFixed(0);
  veryActive.innerHTML = v.toFixed(0);
  superActive.innerHTML = su.toFixed(0);

  var tdee = (se+l+m+v+su)/5;

  document.querySelector("#result1").innerHTML = bmr;
  resultArea1.style.display = "block";

  resultArea.style.display = "block";
  document.querySelector(".comment").innerHTML =
    `You are <span id="comment">${result}</span>`;
  document.querySelector("#result").innerHTML = bmi.toFixed(2);
  fetch('/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sex1, age1, bmi, bmr,tdee })
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Post created:', data);
      call_p()
    })
    .catch((err) => {
      console.error('Error creating post:', err);
    });
}

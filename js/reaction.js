const box = document.querySelector(".box");
const boxParagraph = document.querySelector(".description");
const resultParagraph = document.querySelector(".result");
const loader = document.querySelector(".loader");
const summary = document.querySelector(".summary");
const activeSummary = document.getElementsByClassName('summary--active');

const resultsArray = [];
const getRandomTime = () => {
   const time1 = Math.ceil(Math.random() * 8000);
   const time2 = Math.ceil(Math.random() * time1 + 2000);
   return time2;
};
const setInitialPink = () => {
   box.style.backgroundColor = "#e57373";
   boxParagraph.textContent = "클릭해서 시작하세요!";
   resultParagraph.textContent = "";
   loader.style.display = "none";
}
const setPinkState = time => {
   resultsArray.push(`${time}ms`);
   console.log(resultsArray);
   box.style.backgroundColor = "#e57373";
   boxParagraph.innerHTML = `당신은 <b>${time} ms </b>만에 클릭했습니다!`;
   resultParagraph.textContent = "다시 플레이하려면 클릭하세요.";
   loader.style.display = "none";
};
const setGreenState = () => {
   box.style.backgroundColor = "#4BDB6A";
   boxParagraph.textContent = "지금 클릭하세요!!!";
   loader.style.display = "none";
};
const setRedState = () => {
   box.style.backgroundColor = "#CE2636";
   resultParagraph.textContent = "";
   boxParagraph.textContent = "초록색이 보일 때까지 기다리세요.";
   loader.style.display = "block";
};
const tooFastState = () => {
   box.style.backgroundColor = "#e57373";
   boxParagraph.textContent = "너무 빨리 클릭했습니다.";
   resultParagraph.textContent = `클릭하여 다시 시작하세요.`;
   loader.style.display = "none";
};
const showSummary = (e) => {
   summary.textContent = 'exit the leaderboard'
   box.style.backgroundColor = "#6734BA";
   resultParagraph.textContent = "";
   boxParagraph.textContent = "Leaderboard:";
   resultParagraph.textContent = `${resultsArray}`
}

let startTime;
let waitingTime;
let timeoutIndex;
let flag = false;
const start = (e) => {

   if(e.target.classList.contains('active')) {
      showSummary();
      return;
   }
   else if(flag == false){
      setInitialPink();
   }
   if (flag) {
      const endTime = new Date().getTime();
      let reactionTime = endTime - startTime - waitingTime;
      flag = false;
      if (reactionTime < 0) {
         clearTimeout(timeoutIndex);
         tooFastState();
      } else setPinkState(reactionTime);
   } else {
      flag = true;
      setRedState();
      waitingTime = getRandomTime();
      startTime = new Date().getTime();
      timeoutIndex = setTimeout(() => {
         setGreenState();
      }, waitingTime);
   }
};
box.addEventListener("mousedown", start);
summary.addEventListener("mousedown", (e) => {
   e.target.classList.toggle('active');
});
export const CONSENT =
  ' <center><img width="300px" src="assets/stanford.png" /></center>' +
  '<div id="legal"></br>By answering the following questions, you are participating in a study being performed ' +
  "by cognitive scientists in the Stanford Department of Psychology. If you have questions about this " +
  'research, please contact us at  <a href="mailto://languagecoglab@gmail.com."> languagecoglab@gmail.com</a>.' +
  "You must be at least 18 years old to participate. Your participation in this research is voluntary. " +
  "You may decline to answer any or all of the following questions. You may decline further participation, " +
  "at any time, without adverse consequences. Your anonymity is assured; the researchers who have requested " +
  "your participation will not receive any personal information about you. </div></br>";

export const INSTRUCTIONS =
  "<h2> Thanks for helping us out by testing out our experiment!<h2><br>" +
  "<h3>Please read these instructions carefully!</h3> </br>" +
  "<p>For this experiment, please place your <b>left index finger on the 'e' key</b> and" +
  " your <b>right index finger on the 'i' key</b>.</p>" +
  "<p> You will read sentences word by word. " +
  "However, you will have to guess which word comes next.</p> " +
  "<p>On each screen you will see <b>two</b> options: one will be the next word in the sentence, and one will not. </p>" +
  "<p><b>Select the word that continues the sentence by pressing 'e' (left-hand) for the word on the left <br>or" +
  "pressing 'i' (right-hand) for the word on the right.</b></p>" +
  "<p>Select the best word as quickly as you can, but without making too many errors. </p>" +
  '<div><p>Click "Continue" to try this on a practice sentence.</p></div>';

export const INSTRUCTIONS2 =
  "<p>Great job! Now you are ready for the main experiment.</p>" +
  "<p> You will now read a paragraph in the same word-by-word way.</p>" +
  '<div><p>Click "Continue" to start the experiment.</p>';

export const POST_SURVEY_TEXT =
  "<h1>End of the experiment.</h1>" +
  "Before you go, we have a couple questions.</br>" +
  "Your answers here will help us design better future experiments.";

export const POST_SURVEY_QS = [
  {
    prompt: "How old are you (in years)?",
    name: "age",
    rows: 1,
  },
  {
    prompt:
      "Were the instructions and task clear? " +
      "Was there anything you found confusing?",
    name: "understand",
    rows: 4,
  },
  {
    prompt: "How was your experience? Fun? Boring? Too hard?",
    name: "length",
    rows: 4,
  },
  {
    prompt: "Were there any problems or errors with the experiment?",
    name: "errors",
    rows: 4,
  },
  { prompt: "Any other comments?", name: "other", rows: 4 },
];
export const DEBRIEF =
  "<h2>Many thanks for participating!</h2>" +
  "<p>We are trying to see whether this way of reading sentences word by word <br> can be used to measure the language processing in younger people.</p>" +
  "<p>The text was adapted from Wikipedia articles and the images were from Wikipedia and Wikimedia Commons.</p>" +
  "<h1>Press continue to finish. </h1>";
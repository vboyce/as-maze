/**
 * @title expt1
 * @description
 * @version 0.1.0
 *
 * @assets assets/
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";
//import SprButtonPlugin from "./spr-buttons.js";
import MazePlugin from "./maze.js";

import { initJsPsych } from "jspsych";

import HtmlButtonResponsePlugin from "@jspsych/plugin-html-button-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import CallFunctionPlugin from "@jspsych/plugin-call-function";
import SurveyTextPlugin from "@jspsych/plugin-survey-text";

import { proliferate } from "./proliferate.js";
import { counterbalance } from "./helper.js";

import { stimuli } from "./stimuli.js";
import {
  choices,
  all_images,
  format_spr,
  format_image_header,
  give_feedback,
  format_header,
} from "./constants.js";

import {
  CONSENT,
  POST_SURVEY_QS,
  POST_SURVEY_TEXT,
  DEBRIEF,
  INSTRUCTIONS,
  INSTRUCTIONS2,
} from "./instructions.js";
/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */

let done = 1;
const BONUS = 5;
console.log(stimuli);
const practice = stimuli.filter((item) => {
  return item.type == "practice";
})[0];
console.log(practice);
const select_stimuli = counterbalance(
  [["ambig_1", "ambig_2", "unambig_1", "unambig_2"], ["filler"]],
  stimuli
);
console.log(select_stimuli);
const trials = select_stimuli.length + 1;
export async function run({
  assetPaths,
  input = {},
  environment,
  title,
  version,
}) {
  const jsPsych = initJsPsych({
    on_close: function () {
      //console.log("start the thing");
      var data = jsPsych.data.get().values();
      //console.log("middle");
      //console.log(data);
      //console.log(data[0]);
      proliferate.submit(
        { trials: data },
        () => {
          //console.log("doing the thing");
        },
        (i) => {
          //console.log("waaaah");
          //console.log(JSON.stringify(i));
        }
      );
    },
  });

  let countCorrect = 0;
  let done = 1;
  let consent = {
    type: HtmlButtonResponsePlugin,
    stimulus: CONSENT,
    choices: ["Continue"],
    response_ends_trial: true,
  };

  let instructions = {
    type: HtmlButtonResponsePlugin,
    stimulus: INSTRUCTIONS,
    choices: ["Continue"],
    response_ends_trial: true,
  };

  let instructions2 = {
    type: HtmlButtonResponsePlugin,
    stimulus: INSTRUCTIONS2,
    choices: ["Continue"],
    response_ends_trial: true,
  };
  let post_test_questions = {
    type: SurveyTextPlugin,
    preamble: POST_SURVEY_TEXT,
    questions: POST_SURVEY_QS,
  };

  let end_experiment = {
    type: HtmlButtonResponsePlugin,
    stimulus: DEBRIEF,
    choices: ["Continue"],
  };

  let send_data = {
    type: CallFunctionPlugin,
    async: true,
    func: function (done) {
      proliferate.submit({ trials: jsPsych.data.get().values() });
    },
  };

  let image_practice = {
    type: HtmlButtonResponsePlugin,
    css_classes: ["maze-display"],
    stimulus: function () {
      let head =
        `<div id="status"><p>Story ` +
        done +
        `/` +
        trials +
        "</p><p> Preview the scene.</p>";
      let img_format =
        '<img  style="width: 800px;" src=assets/images/' +
        practice.image +
        "></div>";
      let tail =
        `<canvas width="1000" height="100" id="SprCanvas"></canvas>` +
        `<div style="height: 300px; display: flex; place-content: center;" id="feedback"></div>`;
      return head + img_format + tail;
    },
    choices: [],
    trial_duration: 3000,
  };

  let practice_trial = {
    type: MazePlugin,
    correct: practice.correct,
    distractor: practice.distractor,
    css_classes: ["maze-display"],
    prompt: function () {
      let head = format_header(done, trials);
      let img_format =
        '<img  style="width: 800px;" src=assets/images/' + practice.image + ">";
      return head + img_format;
    },
    data: {
      sentence: practice.correct,
      type: practice.type,
      item: practice.item,
    },
  };

  let spacer = {
    type: HtmlButtonResponsePlugin,
    stimulus: "",
    choices: [],
    trial_duration: 1000,
    on_finish: function () {
      done++;
    },
  };

  let image_trial = {
    type: HtmlButtonResponsePlugin,
    css_classes: ["maze-display"],
    stimulus: function () {
      let head =
        `<div id="status"><p>Story ` +
        done +
        `/` +
        trials +
        "</p><p> Preview the scene.</p>";
      let img_format =
        '<img  style="width: 800px;" src=assets/images/' +
        jsPsych.timelineVariable("image") +
        "></div>";
      let tail =
        `<canvas width="1000" height="100" id="SprCanvas"></canvas>` +
        `<div style="height: 300px; display: flex; place-content: center;" id="feedback"></div>`;
      return head + img_format + tail;
    },
    choices: [],
    trial_duration: 3000,
  };

  let trial = {
    type: MazePlugin,
    correct: jsPsych.timelineVariable("correct"),
    distractor: jsPsych.timelineVariable("distractor"),
    css_classes: ["maze-display"],
    prompt: function () {
      let head = format_header(done, trials);
      let img_format =
        '<img  style="width: 800px;" src=assets/images/' +
        jsPsych.timelineVariable("image") +
        ">";
      return head + img_format;
    },
    data: {
      sentence: jsPsych.timelineVariable("correct"),
      type: jsPsych.timelineVariable("type"),
      item: jsPsych.timelineVariable("item"),
    },
  };

  let practice_1 = {
    type: MazePlugin,
    correct:
      "This is a practice sentence that you are reading one word at a time.",
    distractor:
      "x-x-x whom knew appeared emotions know dad lake edition jack fans fund grow died.",
    css_classes: ["maze-display"],
    prompt: function () {
      return "<p>Practice</p><p> Select the next word by pressing <b>e</b> (left) or <b>i</b> (right).</p>";
    },
  };
  let preload = {
    type: PreloadPlugin,
    images: all_images,
  };

  function getTimeline() {
    //////////////// timeline /////////////////////////////////
    let timeline = [];

    timeline.push(preload);

    //timeline.push(consent);
    timeline.push(instructions);
    timeline.push(practice_1);
    timeline.push(instructions2);
    timeline.push(image_practice);
    timeline.push(practice_trial);
    let mini_timeline = {
      timeline: [spacer, image_trial, trial],
      timeline_variables: select_stimuli,
    };
    timeline.push(mini_timeline);
    timeline.push(post_test_questions);
    timeline.push(end_experiment);
    timeline.push(send_data);
    return timeline;
  }

  let timeline = getTimeline();
  await jsPsych.run(timeline);
}

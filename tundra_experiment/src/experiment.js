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

import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import HtmlButtonResponsePlugin from "@jspsych/plugin-html-button-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import CallFunctionPlugin from "@jspsych/plugin-call-function";
import SurveyTextPlugin from "@jspsych/plugin-survey-text";

import { proliferate } from "./proliferate.js";
import { subset } from "./helper.js";

import { stimuli } from "./stimuli.js";
import {
  choices,
  all_images,
  format_spr,
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

export async function run({
  assetPaths,
  input = {},
  environment,
  title,
  version,
}) {
  const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
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
  let done = 0;
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
    on_finish: function () {
      done++;
      jsPsych.setProgressBar(done / 20);
    },
  };

  let instructions2 = {
    type: HtmlButtonResponsePlugin,
    stimulus: INSTRUCTIONS2,
    choices: ["Continue"],
    response_ends_trial: true,
    on_finish: function () {
      done++;
      jsPsych.setProgressBar(done / 20);
    },
  };
  let post_test_questions = {
    type: SurveyTextPlugin,
    preamble: POST_SURVEY_TEXT,
    questions: POST_SURVEY_QS,
    on_finish: function () {
      jsPsych.setProgressBar(1);
    },
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

  let trial = {
    type: MazePlugin,
    correct: jsPsych.timelineVariable("sent"),
    distractor: jsPsych.timelineVariable("distractor"),
    css_classes: ["maze-display"],
    prompt: "",
    data: {
      sentence: jsPsych.timelineVariable("correct"),
    },
  };
  let practice = {
    type: MazePlugin,
    correct: "The dog chased the squirrel up a tree.",
    distractor: "x-x-x no lake grow appeal died sun runs.",
    css_classes: ["maze-display"],
    prompt: function () {
      return (
        "<p>Practice</p><br><p> Select the word that will make a sentence by pressing <b>e</b> or <b>i</b>.</p><br><br>" +
        "<h1> <b>e</b> " +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>i</b> </h1>"
      );
    },
    on_finish: function () {
      done++;
      jsPsych.setProgressBar(done / 20);
    },
  };
  let spacer = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function () {
      console.log(jsPsych.timelineVariable("img"));
      return (
        '<img  style="width: 800px;" src=assets/images/' +
        jsPsych.timelineVariable("img") +
        "> <br><br><p>Press spacebar to continue.</p>"
      );
    },
    choices: [" "],
    on_finish: function () {
      done++;
      jsPsych.setProgressBar(done / 20);
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
    timeline.push(practice);
    timeline.push(instructions2);
    let mini_timeline = {
      timeline: [trial, spacer],
      timeline_variables: stimuli,
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

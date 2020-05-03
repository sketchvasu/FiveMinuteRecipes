'use strict';
const Alexa = require('ask-sdk-v1adapter');
const APP_ID = undefined;

/***********
Data: Customize the data below as you please.
***********/

const SKILL_NAME = "Five Minute Recipes";
const STOP_MESSAGE = "See you next time.";
const CANCEL_MESSAGE = "Okay. Do you want to hear a different recipe instead?";

const HELP_START = "I know how to make tasty meals in less than 5 minutes.";
const HELP_START_REPROMPT = "Just tell me what type of meal you'd like.";
const HELP_RECIPE = "Choose whatever recipe you want.";
const HELP_RECIPE_REPROMPT = "Just ask me for a recipe.";
const HELP_INSTRUCTIONS = "You can ask me to repeat the instructions or say 'next' to hear the next line of instructions.";
const HELP_INSTRUCTIONS_REPROMPT = "Hello.";
const HELP_CANCEL = "You can hear a new recipe or just not eat.";
const HELP_CANCEL_REPROMPT = "Not eating so far caused 100% of test subjects to die.";

const CHOOSE_TYPE_MESSAGE = "Welcome to five minute recipes! I know some cool breakfast, lunch, snack, or dinner foods. What kind of recipe are you looking for?";
const REPROMPT_TYPE = "You can choose a breakfast, lunch, snack, or dinner recipe. What type of recipe would you like to choose?";
const MEALTYPE_NOT_IN_LIST = chosenType => `Sorry, I couldn't find any recipes for ${chosenType}. Do you want a breakfast, lunch, dinner or snack recipe?`;

const RECIPE_ADJECTIVES = [
  "awesome",
  "super simple",
  "fun",
  "extremely tasty"
];
const SUGGEST_RECIPE = recipeName => `I found this ${_pickRandom(RECIPE_ADJECTIVES)} ${recipeName} recipe! Do you want me to tell you how to make ${recipeName}?`;
const MISUNDERSTOOD_RECIPE_ANSWER = "Please answer with yes or no.";
const NO_REMAINING_RECIPE = "This was it. I don't know any more recipes. Do you want to select a different meal type?"
const INGREDIENTS_INTRO = "You will need"; // Here follows a list of ingredients
const INGREDIENTS_ENDING = "Does that sound like a meal you want to eat?"; // Will be said after the list of ingredients


const FIRST_TIME_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last line of instructions again.";
const REPROMPT_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last line of instructions again.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Sorry, I didn't understand you there.";
const CLOSING_MESSAGE = "Wonderful. Hope you have a great meal, or as the Germans say, Guten Appetit!";

const recipes = {
  breakfast: [
    {
      name: "Vegetable Cheese Wrap",
      instructions: [
        "You'll need some , cheese of your choosing.",
        "Find some tortillas.",
        "Spread a thick layer of cheese on to the tortillas.",
        "Dump vegetables of your choice and tost it.",
        "There you go! You just made a delicious cheese wrap. Goodbye."
      ],
      ingredients: [
        "cheese",
        "tortillas",
        "vegetables"
      ]
    },
    {
      name: "Cereal",
      instructions: [
        "You'll need some milk and cereal.",
        "Get a bowl",
        "Fill it half-way with cereal.",
        "Now fill up the rest of the bowl with milk.",
        "Mmmmmh. This is going to be some gooood breakfast."
      ],
      ingredients: [
        "cereal"
      ]
    },
    {
      name: "Tofu and Vegetable Sandwich",
      instructions: [
        "For this recipe you will need to buy some simple frying oil, vegetables, tofu cubes and bread of your choice.",
        "Spread a thin layer of oil on a pan and start heating it on the stove.",
        "Throw the tofu cubes into the pan and wait until the tofu is significantly brown in color.",
        "Take out the cubes and put it aside. Get the vegetables, stirfry them and gently let their content into the pan.",
        "The vegetables are done when all the sides are slightly brown and they are not burnt.",
        "Bam! That's what I call some healthy, tasty, awesome breakfast!"
      ],
      ingredients: [
        "tofu",
        "vegetables",
        "bread"
      ]
    }
  ],
  lunch: [
    {
      name: "Paneer Kathi Roll",
      instructions: [
        "You'll need some grated or chopped vegetables, tortillas and spices for this... and of course paneer. But I don't think I need to mention that.",
        "Fill a pot with water, place them on the stove and turn up the heat all the way. Once the water is boiling, turn off the stove and put the paneer in the pot and let it sit for ten minutes.",
        "Spread a thin layer of oil on a pan and start heating it on the stove. Add all the grated or chopped vegetables of your choice.",
        "Now, wait until the vegetables turn golden brown, have exactly the color you like.",
        "Now, take a spoonful of this stuffing and paneer cubes and spread it on the tortillas and roll it.",
        "Excellent! Paneer Kathi Roll is ready. This is some gooood eating."
      ],
      ingredients: [
        "paneer",
        "chopped or grated vegetables of your choice",
        "tortillas",
        "water"
      ]
    },
    {
      name: "Vegetable Cutlet",
      instructions: [
        "Boil all the vegetables of your choice by adding some salt.",
        "Wait until they cooldown. Mash those vegetables. Make them as small dumplings and flatten them.",
        "Spread a thin layer of oil in a pan and toast these flattened dumplings until they turn golden brown",
        "Once they are ready, dip it in sauce of your choice, rejoice."
      ],
      ingredients: [
        "vegetables",
        "oil",
        "salt"
      ]
    },
    {
      name: "Masala Papad",
      instructions: [
        "You need some onions, tomatoes and cilantro for this. Chop the onions, cilantro and tomatoes in to small pieces.",
        "Grease the papad with some butter.",
        "Then heat the papad in the microwave for 10sec and take it out",
        "Add the chopped vegetables to the papad.",
        "Sprinkle some salt on top and enjoy it!"
      ],
      ingredients: [
        "onions",
        "tomatoes",
        "cilantro",
        "butter",
        "salt"
      ]
    }
  ],
  dinner: [
    {
      name: "Paneer Parantha",
      instructions: [
        "You need whole wheat flour and paneer for this!",
        "Knead the flour into a dough and grate the paneer. Then fill the dough with the grated paneer and flatten it using a rolling pin",
        "Preheat the oven at 180 degrees celcius.",
        "Once the oven is preheated put the flattened, panner filled dough in there. Let it bake for three minutes.",
        "After 3 to 5 minutes take the parantha out of the oven and enjoy the yummy parantha."
      ],
      ingredients: [
        "wheat flour",
        "grated paneer"
      ]
    },
    {
      name: "Aloo Parantha",
      instructions: [
        "For this recipe you just need whole wheat flour and potatoes.",
        "Boil the potatoes in a pot of water on the stove. Knead the whole wheat flour into a soft dough.",
        "Peel the boiled potatoes and grate them or mash them. Make the dough into small dumplings and fill it with the mashed potatoes.",
        "Flatten the dumplings using a rolling pin and put it in the oven at 180 degrees celcius for 3 minutes",
        "After 3 minutes take the parantha out of the oven and enjoy it with a cup of curd."
      ],
      ingredients: [
        "whole wheat flour",
        "potatoes"
      ]
    },
    {
      name: "Sev Puri",
      instructions: [
        "You need chopped onions, tomatoes and mashed potatoes, sev, curd and puris for this.",
        "Mix all the onions, tomatoes and potatoes.",
        "Make a small hole in the puri just by poking it with your thumb.",
        "Add a spoonful of this mixture to the puri and add some curd to it.",
        "Now, fill your mouth with the puri and enjoy the delicacy.",
        "Perfect. This is a really fancy meal."
      ],
      ingredients: [
        "onions",
        "tomatoes",
        "potatoes",
        "sev",
        "puris"
      ]
    }
  ],
  snack: [
    {
      name: "Chips",
      instructions: [
        "Go to the closest supermarket and buy a bag of chips.",
        "Open the bag.",
        "Enjoy!"
      ],
      ingredients: [
        "chips"
      ]
    },
    {
      name: "Banana",
      instructions: [
        "If you happen to live in the jungle, you might find a banana on a tree somewhere. If you don't, you might have to go to a market close by.",
        "Pick a yellow banana. Don't pick a green banana. Those have to sit for a while before being edible. And we want this recipe to be done within 5 minutes. So seriously, don't screw this up. Pick a yellow banana!",
        "Feeling like a monkey today? Well that's important sometimes, too."
      ],
      ingredients: [
        "banana"
      ]
    },
    {
      name: "Samosa",
      instructions: [
        "Go to a grocery store and buy some frozen samosas.",
        "Great! Now open the bag.",
        "Bake the samosas at 350 degrees celcius for 10 minutes.",
        "Take it out and enjoy the samosas with some pickle"
      ],
      ingredients: [
        "samosas"
      ]
    }
  ]
};

/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)

const _getCurrentStep = handler => handler.attributes['instructions'][handler.attributes['current_step']];

const _intentAndSlotPresent = handler => {
  try {
    return handler.event.request.intent.slots.mealType;
  }
  catch (e){
    return false;
  }
};
const _selectedMealType = handler => {
  return _intentAndSlotPresent(handler) && handler.event.request.intent.slots.mealType.value;
};
const _checkMealTypePresence = handler => {
  return Object.keys(recipes).includes(_selectedMealType(handler));
};
const _setMealType = handler => {
  // Reset remaining recipes in case the user went back from before
  handler.attributes['mealType'] = _selectedMealType(handler);
  handler.attributes['remainingRecipes'] = recipes[handler.attributes['mealType']];
  handler.handler.state = states.RECIPEMODE;
  handler.emitWithState("Recipe");
  return true;
};

const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _pickRandom = (array) => array[_randomIndexOfArray(array)];

// Handle user input and intents:

const states = {
  STARTMODE: "_STARTMODE",
  RECIPEMODE: "_RECIPEMODE",
  INSTRUCTIONSMODE: "_INSTRUCTIONSMODE",
  CANCELMODE: "_CANCELMODE"
};


const newSessionhandlers = {
  'NewSession': function(){
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
};

const startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'NewSession': function(startMessage = CHOOSE_TYPE_MESSAGE){
    if(_checkMealTypePresence(this)){
      // Go directly to selecting a meal if mealtype was already present in the slots
      _setMealType(this);
    }else{
      this.emit(':ask', startMessage, REPROMPT_TYPE);
    }
  },
  'ChooseTypeIntent': function(){
    if(_checkMealTypePresence(this)){
      _setMealType(this);
    }else{
      this.emit(':ask', MEALTYPE_NOT_IN_LIST(_selectedMealType(this)), MEALTYPE_NOT_IN_LIST(_selectedMealType(this)));
    }
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
});

const recipeModeHandlers = Alexa.CreateStateHandler(states.RECIPEMODE, {
  'Recipe': function(){
    if(this.new){
      this.attributes['remainingRecipes'] = recipes[this.handler.attributes['mealType']];
    }

    if(this.attributes['remainingRecipes'].length > 0){
      // Select random recipe and remove it form remainingRecipes
      this.attributes['recipe'] = this.attributes['remainingRecipes'].splice(_randomIndexOfArray(this.attributes['remainingRecipes']), 1)[0]; // Select a random recipe
      // Ask user to confirm selection
      this.emit(':ask', SUGGEST_RECIPE(this.attributes['recipe'].name), SUGGEST_RECIPE(this.attributes['recipe'].name));
    }else{
      this.attributes['remainingRecipes'] = recipes[this.attributes['mealType']];
      this.handler.state = states.CANCELMODE;
      this.emitWithState('NoRecipeLeftHandler');
    }
  },
  'IngredientsIntent': function(){
    var ingredients = this.attributes['recipe'].ingredients.join(', ').replace(/,(?!.*,)/gmi, ' and'); // Add 'and' before last ingredient

    this.emit(':ask', `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`, `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`)
  },
  'AMAZON.YesIntent': function(){
    this.attributes['instructions'] = this.attributes['recipe'].instructions;
    this.attributes['current_step'] = 0;
    this.handler.state = states.INSTRUCTIONSMODE;
    this.emitWithState('InstructionsIntent');
  },
  'AMAZON.NoIntent': function(){
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_RECIPE, HELP_RECIPE_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.handler.state = states.CANCELMODE;
    this.emitWithState('AskToCancelHandler');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER, MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

const instructionsModeHandlers = Alexa.CreateStateHandler(states.INSTRUCTIONSMODE, {
  'InstructionsIntent': function(){
    const firstTimeInstructions = (this.attributes['current_step'] === 0) ? FIRST_TIME_INSTRUCTIONS : '';
    this.emit(':ask', `${_getCurrentStep(this)} ${firstTimeInstructions}`, REPROMPT_INSTRUCTIONS);
  },
  'NextStepIntent': function(){
    this.attributes['current_step']++;

    if(this.attributes['current_step'] < this.attributes['instructions'].length - 1){
      this.emitWithState('InstructionsIntent');
    }else{
      this.emitWithState('InstructionsEnded');
    }
  },
  'InstructionsEnded': function(){
    this.emit(':tell', `${_getCurrentStep(this)} ${CLOSING_MESSAGE}`);
  },
  'DifferentRecipeIntent': function(){
    this.handler.state = states.RECIPEMODE;
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_INSTRUCTIONS, HELP_INSTRUCTIONS_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.handler.state = states.CANCELMODE;
    this.emitWithState('AskToCancelHandler');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER, MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
  }
});


const cancelModeHandlers = Alexa.CreateStateHandler(states.CANCELMODE, {
  'NoRecipeLeftHandler': function(){
    this.emit(':ask', NO_REMAINING_RECIPE, NO_REMAINING_RECIPE);
  },
  'AskToCancelHandler': function(){
    this.emit(':ask', CANCEL_MESSAGE, CANCEL_MESSAGE);
  },
  'AMAZON.YesIntent': function(){
    this.attributes['current_step'] = 0;
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession', REPROMPT_TYPE);
  },
  'AMAZON.NoIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_CANCEL, HELP_CANCEL_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER, MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(newSessionhandlers, startModeHandlers, recipeModeHandlers, instructionsModeHandlers, cancelModeHandlers);
  alexa.execute();
};
<template>
  <div id="app">
    <v-app>
      <v-content>
        <v-app-bar color="transparent" dark elevation="0">
          <v-toolbar-title> <span class="brand"><span class="bold">Trivia</span> with Bnice</span>
          </v-toolbar-title>
        </v-app-bar>
        <v-container class="container trivia text-center">
          <v-card 
            dark
            class="mycard p3 animated fadeIn"               
            max-width="600px" 
            elevation=0 
            color="rgba(255, 255, 255, 0)" 
            v-if="isloaded && lives > 0"
          >
            <div class="content">
              <v-card-title>
                <div class="question">
                  <h2>{{question}}</h2>
                </div>
              </v-card-title>
              <v-card-subtitle>
                <div class="difficulty">
                  <h3>Difficulty: {{difficulty}}</h3>
                </div>
              </v-card-subtitle>

              <v-card-text v-if="!iscorrect && !iswrong">

                <v-btn-toggle v-model="useranswer" class="btn-group" group>

                  <div class="answers" v-for="answer in answers">
                    <v-btn 
                          :value="answer" 
                          v-on:click="testAnswer" 
                          class="btn" 
                          color="rgba(14, 133, 255, 0.13)"
                          >{{answer}}
                    </v-btn>
                  </div>

                </v-btn-toggle>
              </v-card-text>

              <v-card-text class="correct" v-if="iscorrect">
                <h1>{{useranswer}} is Correct!</h1>
                <p><strong>Lives Remaining: {{lives}} <br> Score: {{score}}
                  </strong></p>
                <v-btn @click="getQuestion">Next Question</v-btn>

              </v-card-text>
              <v-card-text class="wrong" v-if="iswrong">
                <h1>{{useranswer}} is Wrong!</h1>
                <p class="pt-1"><strong>The correct answer: {{correctAnswer}}</strong></p>
                  <p>Lives Remaining: {{lives}} <br>
                    Score: {{score}}
                  </p>
                  <v-btn @click="getQuestion">Next Question</v-btn>
              </v-card-text>
            </div>
          </v-card>
            <v-card
              dark
              class="finalScore"
              elevation="0"
              color="rgba(0,0,0,0)"
              width="300px"
              v-if="lives < 1">
              <v-card-text>
                <h1>Final Score:<br><br><br>
                <span class="emphasize">{{score}}</span></h1>
                <v-col class="mx-auto" cols="9" v-if="!submitted" >
                    <v-text-field
                      v-model="initials"
                      label="Enter Initials"
                      outlined
                      counter="3"
                      clearable
                      maxlength="3"
                    ></v-text-field>
                  </v-col>
              </v-card-text>
              <v-card-text v-if="submitted">
                <h4 class="text-center">High Scores</h4>
                <div class="score-container" v-for="highscore in highscores">
                  <p class="high-scores">{{highscore.initials}} | {{highscore.score}}</p>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="submitScore" class="mx-auto" v-if="!submitted">Enter</v-btn>
                <v-btn @click="restartGame" class="mx-auto" v-if="submitted">Play Again</v-btn>
              </v-card-actions>
            </v-card>
        </v-container>
        <div class="github-mark">
          <a href="https://github.com/bSampson0/trivia-chrome-extension">
            <img src="@/assets/GitHub-Mark-64px.png" alt="github mark">
          </a>
        </div>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { fireDb } from '@/plugins/firebaseConfig.js'

export default {
  name: 'App',
   data: () => ({
    isloaded: false,
    test: 'test',
    question: '',
    answers: [],
    correctAnswer: null,
    iscorrect: false,
    difficulty: null,
    useranswer: null,
    iswrong: false,
    lives: 3,
    score: 0,
    submitted: false,
    initials: null,
    highscores: []
  }),
  created() {
    //get data
    function shuffle(array) {
      array.sort(() => Math.random() - 0.5);
    }   
    this.score = 0
    this.lives = 3
    
    fetch('https://opentdb.com/api.php?amount=1&type=multiple')
    .then(resp => resp.json())
    .then(json => {
      //pass data to variables
      this.question = json.results[0].question.replace(/&quot;/g,'"').replace(/&#039;|&apos;/g, "'")
      this.difficulty = json.results[0].difficulty
      this.correctAnswer = json.results[0].correct_answer.replace(/&quot;/g,'"').replace(/&#039;|&apos;/g, "'")
      //populate answers array
      this.answers.push(json.results[0].correct_answer.replace(/&quot;/g,'"').replace(/&#039;|&apos;/g, "'"))
      json.results[0].incorrect_answers.forEach(answer => {
        this.answers.push(answer.replace(/&quot;/g,'"').replace(/&#039;|&apos;/g, "'"))
      })
      shuffle(this.answers)
      this.isloaded = true
    })
  },
  methods: {
    testAnswer(useranswer) {
      let answer = useranswer.path[1].innerText.toLowerCase()
      if (answer != this.correctAnswer.toLowerCase()) {
        console.log('incorrect!')
        this.iswrong = true
        this.lives = this.lives - 1
      } else {
        console.log('correct!')
        this.iscorrect = true
        if (this.difficulty == 'hard') this.score = this.score + 300
        if (this.difficulty == 'medium') this.score = this.score + 200
        if (this.difficulty == 'easy') this.score = this.score + 100
      }
      console.log(`Score: ${this.score} | Lives: ${this.lives}`)
    },
    getQuestion() {
      this.iscorrect = false
      this.iswrong = false
      this.answers.length = 0
      this.useranswer = null
      function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
      }
       fetch('https://opentdb.com/api.php?amount=1&type=multiple')
    .then(resp => resp.json())
    .then(json => {
      //pass data to variables
      this.question = json.results[0].question.replace(/&quot;/g,'"').replace(/&#039;|&apos;/g, "'")
      this.difficulty = json.results[0].difficulty
      this.correctAnswer = json.results[0].correct_answer.replace(/&quot;/g,'"').replace(/&#039;|&apos;/g, "'")
      //populate answers array
      this.answers.push(json.results[0].correct_answer.replace(/&quot;/g,'"').replace(/&#039;|&apos;/g, "'"))
      json.results[0].incorrect_answers.forEach(answer => {
        this.answers.push(answer.replace(/&quot;/g,'"').replace(/&#039;|&apos;/g, "'"))
      })
      shuffle(this.answers)
      this.isloaded = true
    })
    },
    submitScore() {
      this.writeScores()
      this.getScores()
      this.submitted = true
    },
    restartGame() {
      location.reload(true)
    },
    async getScores() {
      fireDb.collection('highscores').orderBy('score', 'desc').limit(5).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log((doc.id, '=>', doc.data().initials))
          this.highscores.push((doc.id, '=>', doc.data()))
        })      
      })
    },
    async writeScores() {
      const ref = fireDb.collection("highscores").add({
        initials: this.initials,
        score: this.score
      })  
    }
  }
}
</script>

<style>
#app {
  background: #0F2027;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #080808, #151212, #0F2027); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #080808, #151212, #0F2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

h1, h2, h3, h4, h5, p, .brand, .btn {
  font-family: 'Montserrat', sans-serif !important;
}

ul {
  list-style: none;
}

.score-container {
  padding-top: 2em;
}

.high-scores {
  line-height: .8em;
  font-size: 1.2em;
  
}

.brand {
  opacity: .8;
}

.content {
  padding-top: 8em;
  opacity: .7;
}

.emphasize {
  font-size: 3em;
}

.btn {
  font-weight: 900;
}

.main {
  display: flex;
  flex-direction: row;
}

.question {
  word-break: break-word;
  line-height: 1.7em;
}
.main { 
  justify-content: center;
  align-content: center;
  margin-bottom: -1em;
}
.trivia {
  display: flex;
  justify-content: center;
  align-content: center;
}

.btn-group {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
}

.answers .btn {
  margin: 5px;
}

.difficulty {
  margin-top: .6em;
  margin-bottom: .5em;
}

.correct {
  line-height: 2em;
}

.bold {
  font-weight: 900;
}

.github-mark {
  display: flex;
  justify-content: center;
}
.github-mark img {
  height: 25px;
  width: 25px;
}
</style>

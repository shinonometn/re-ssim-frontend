<template>
  <div class="container-fuild" style="margin:10pt">
    <div class="row">

      <!-- Term info, class choosing and exclude type choosing -->
      <div class="col col-lg-4">
        <mu-paper :z-depth='1'>

          <mu-appbar style="width: 100%;" color="primary">
            <div>
              <p>班级课表</p>
            </div>
            <mu-button flat slot="right" @click="$router.go(-1)">
              <mu-icon left value="arrow_back"></mu-icon>
              返回
            </mu-button>
          </mu-appbar>

          <div style="padding: 3pt 10pt">

            <div>
              <div style="padding:5pt 0pt; font-size: 17px">当前学期</div>
              <mu-button full-width>{{term}}</mu-button>
            </div>
            
            <div>
              <div style="padding:5pt 0pt; font-size: 17px">班级</div>
              <class-choosing :term="term" @changed="onClassChanged($event)"></class-choosing>
            </div>

            <div>
              <div style="padding:5pt 0pt; font-size: 17px">排除课程类型</div>
              <mu-select v-model="selectedExcludedTypes" chips multiple full-width no-data-text="空">
                <mu-option v-for="(item,index) in courseTypeList" :key="index" :label="item" :value="item"></mu-option>
              </mu-select>
            </div>

          </div>
        </mu-paper>
      </div>

      <div class="col col-lg-8">
        <div style="">
          <!-- Week range list -->
          <week-bar ref="weekBar" 
                    class="mu-elevation-4" 
                    :max="maxWeek" 
                    :min="minWeek" 
                    :activated="activatedWeekList" 
                    v-model="selectedWeek"></week-bar>
        </div>

        <div style="margin: 10pt 5pt 0 0;">
          <div class="view_trigger"><span>日视图</span> <mu-switch v-model="listMode"></mu-switch> <span>周视图</span></div>
        </div>

        <div style="margin-top: 10pt">
          <lesson-list v-if="listMode" :data="queryResult">
            <template slot-scope="scope">
              <div>
                <mu-badge :content="scope.lesson.code" color="primary"></mu-badge> 
                {{scope.lesson.name}}（{{scope.lesson.classType}})
              </div>
              <div style="padding-left: 10pt"><small>{{scope.lesson.position}}， {{scope.lesson.teacher}} 任课</small></div>
            </template>
          </lesson-list>

          <lesson-week-page v-else :data="queryResult">
            <template slot-scope="scope">
              <div>
                <mu-badge :content="scope.lesson.code" color="primary"></mu-badge> 
                {{scope.lesson.name}}（{{scope.lesson.classType}})
              </div>
              <div style="padding-left: 10pt"><small>{{scope.lesson.position}}， {{scope.lesson.teacher}} 任课</small></div>
            </template>
          </lesson-week-page>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Utils from "@/commons/utils";
import Toast from "muse-ui-toast";

import WeekBar from "@/components/weekBar";

import ClassChoosing from "./components/classChoosing";
import TermChoosing from "./components/termChoosing";

import LessonList from "./components/lessonList";
import LessonWeekPage from "./components/lessonWeekPage";

export default {
  name: "pc-class-query",

  components: {
    WeekBar,
    ClassChoosing,
    LessonList,
    LessonWeekPage,
    TermChoosing
  },

  props: {
    term: String
  },

  data: () => {
    return {
      currentTermInfo: {},

      listMode: false,

      activatedWeekList: [],

      // Course type
      courseTypeList: [],

      courseTypeExcludeList: {},

      selectedClass: "",
      selectedWeek: "",
      selectedExcludedTypes: [],

      queryResult: []
    };
  },

  beforeRouterUpdate(_, next) {
    this.getCurrentTerm();
    next();
  },

  mounted() {
    this.getCurrentTerm();
  },

  watch: {
    selectedWeek(newValue, oldValue) {
      this.queryClassLessons();
    },

    selectedClass(newValue, oldValue) {
      this.queryClassLessons();
    },

    selectedExcludedTypes(newValue, oldValue) {
      this.queryClassLessons();
    }
  },

  methods: {

    queryClassLessons() {
      if (!!this.selectedWeek && !!this.selectedWeek) {
        // console.log("New Request")
        Utils.newQuery(`/api/term/${this.term}/class/${this.selectedClass}/course`, {
          // class: this.selectedClass,
          week: this.selectedWeek,
          excludedType: this.selectedExcludedTypes
        }).then(response => {
          this.queryResult = response.data;
        });
      }
    },

    onClassChanged(newClass) {
      Utils.newRequest(`/api/term/${this.term}/class/${newClass}/weeks`).then(
        r => (this.activatedWeekList = r.data.weeks)
      );

      this.selectedClass = newClass;
      this.$refs.weekBar.select(this.selectedWeek);
    },

    // onWeekChanged(newWeek) {
    //   this.selectedWeek = newWeek;
    // }
  },

  computed: {
    switcherLabel: () => this.listMode ? "周列表" : "日列表"
  }
};
</script>

<style scoped>
.view_trigger{
  margin: 0 3pt
}
</style>


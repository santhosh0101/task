<template>
  <div>
        <!-- file uploader button if button false -->
        <div class='input-group' v-show="!config.button">
            <input type='file' :id="config.id" :name="config.name" :disabled="config.disabled" @change="on_click" />
        </div>
        <!-- custom file uploader button -->
        <div v-show="config.button">
            <button class="btn btn-primary" type="button" :class="config.class" :id="config.id" :name="config.name" :disabled="config.disabled"
                @click="trigger">
                {{ config.text }}
            </button>
        </div>
        <br>
        <br>
        <div v-show="config.links"  >
            <button @click="show_chart" v-for="(item, key) in series" >
                <span :data="item.key">{{ item.value }}</span>
            </button>
        </div>
        <br>
        <br>
        <!-- Error Container-->
        <div v-show="error">
            {{ config.error }}
        </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      config: {
        error: '',
        text: 'Upload',
        disabled: false,
        button: true,
        model: {},
        file: null,
        links: false
      },
      series:[
        {key:1, value:"SERIES1"},
        {key:2, value:"SERIES2"},
        {key:3, value:"SERIES3"},
        {key:4, value:"SERIES4"}
      ]
    }
  },
  mounted () {
    
    console.log('file uploader loaded')
  },
  methods: {

        //will upload file to s3 machine          
        on_click: function (e) {
          this.upload_file(e)
        },


        // This will trigger file type input button
        trigger: function (e) {
          console.log(e)
          this.$el.getElementsByTagName("input")[0].click()
        },

        // Upload file 
        upload_file: function (e, callback) {
            console.log("upload_file");
            var that = this;
            var file_input = e.currentTarget;
            var file = file_input.files[0];
            console.log(file);

            if (!(typeof file)) {
                this.config.error = "Invalid file";
                return;
            }

            // Upload to db
            var self = this;
            this.upload_file_to_db(file, function (url) {

                
            });
        },

        // upload file in mongodb using expressjs
        upload_file_to_db: function (file, callback){

          var formData = new FormData();
          formData.append('image', file); 
          var that = this;
           
        this.$http.post('http://localhost:3000/file', formData).then( function(response){ 

                 console.log("Hi "+response);

                 if(response.status == 200){
                   that.config.links = true;
                 }
                
              }, function (response) {

            // error callback
                  console.log("Hi "+response);
             });
        },


        show_chart: function(el){
          console.log(el);
          var series = el.currentTarget.getElementsByTagName("span")[0].getAttribute("data");
          this.$http.get('http://localhost:3000/chart?id='+series).then(function(response){
            console.log("Hi "+response);
          }, function(response){
              console.log(response);
          });
        }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

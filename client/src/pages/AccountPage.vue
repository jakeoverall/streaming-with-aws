<template>
  <div class="about text-center container-fluid">
    <h1>Welcome {{ account.name }}</h1>
    <img class="rounded" :src="account.picture" alt="" />
    <p>{{ account.email }}</p>
  </div>


  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-md-10 col-12 bg-white elevation-3 rounded p-2">
        <form action="" @submit.prevent="editAccount()">
          <div class="mb-2">
            <label for="name">Name</label>
            <input class="form-control" type="text" id="name" minlength="3" maxlength="75" v-model="editable.name">
          </div>
          <div class="mb-2">
            <label for="picture">Picture</label>
            <input class="form-control" type="url" id="picture" minlength="3" maxlength="200" v-model="editable.picture">
          </div>
          <div class="mb-2">
            <label for="coverImg">Cover Image</label>
            <input class="form-control" type="url" id="coverImg" minlength="3" maxlength="200" v-model="editable.coverImg">
          </div>
          <div class="mb-2">
            <label for="bio">Bio</label>
            <textarea class="form-control" name="bio" id="bio" cols="30" rows="10" v-model="editable.bio"></textarea>
          </div>
          <div class="mb-2">
            <label for="linkedin">LinkedIn</label>
            <input class="form-control" type="url" id="linkedin" minlength="3" maxlength="100" v-model="editable.linkedin">
          </div>
          <div class="mb-2 text-end">
            <button class="btn btn-success" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>



</template>

<script>
import { computed, ref, watchEffect } from 'vue';
import { AppState } from '../AppState';
import Pop from '../utils/Pop.js';
import { accountService } from '../services/AccountService.js';
import { logger } from '../utils/Logger.js';
export default {
  setup() {

    const editable = ref({})

    watchEffect(() => {
      logger.log('watchEffect ran')
      editable.value = {...AppState.account}
    })

    return {
      editable,
      account: computed(() => AppState.account),


      async editAccount(){
        try {
          const formData = editable.value
          await accountService.editAccount(formData)
        } catch (error) {
          // @ts-ignore 
          Pop.error(error.message)
        }
      }

    }
  }
}
</script>

<style scoped>
img {
  max-width: 100px;
}

label{
  display: block;
}

</style>
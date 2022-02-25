<template>
  <div class="login">
    <div class="login-bg">
      <svg width="100%" height="100%" viewBox="0 0 1440 600" xmlns="http://www.w3.org/2000/svg" class="transition duration-300 ease-in-out delay-150">
        <path d="M 0,600 C 0,600 0,200 0,200 C 82.88995215311004,184.04784688995215 165.7799043062201,168.09569377990428 260,191 C 354.2200956937799,213.90430622009572 459.77033492822954,275.665071770335 578,273 C 696.2296650717705,270.334928229665 827.1387559808612,203.24401913875596 917,176 C 1006.8612440191388,148.75598086124404 1055.6746411483255,161.35885167464116 1136,172 C 1216.3253588516745,182.64114832535884 1328.1626794258373,191.3205741626794 1440,200 C 1440,200 1440,600 1440,600 Z" stroke="none" stroke-width="0" fill="#9900ef88" class="transition-all duration-300 ease-in-out delay-150 path-0"></path>
        <path d="M 0,600 C 0,600 0,400 0,400 C 103.02392344497608,397.98086124401914 206.04784688995215,395.9617224880382 294,386 C 381.95215311004785,376.0382775119618 454.83253588516754,358.1339712918661 559,364 C 663.1674641148325,369.8660287081339 798.622009569378,399.5023923444976 890,422 C 981.377990430622,444.4976076555024 1028.6794258373207,459.85645933014354 1113,455 C 1197.3205741626793,450.14354066985646 1318.6602870813397,425.07177033492826 1440,400 C 1440,400 1440,600 1440,600 Z" stroke="none" stroke-width="0" fill="#9900efff" class="transition-all duration-300 ease-in-out delay-150 path-1"></path>
      </svg>
    </div>
    <div class="form-container">
      <div class="guide flex">
        <a href="/home.html" :title="$t('首页')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="35"
            height="35"
          >
            <path fill="none" d="M0 0h24v24H0z"/>
            <path fill="#6C63FF" d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19zm2-4h8v2H8v-2z"/>
          </svg>
        </a>
        <a href="" @click.prevent="giteeLogin()" :title="$t('Gitee 授权登录')">
          <svg
            t="1645630280002"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1437"
            width="30"
            height="30"
          >
            <path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="1438"></path>
          </svg>
        </a>
      </div>
      <form>
        <input v-model="form.phoneNumber" class="input" :placeholder="$t('请输入电话')" />
        <div class="input-code flex">
          <input v-model="form.verifyCode" class="input" :placeholder="$t('验证码')" />
          <a
            href=""
            class="code-btn"
            :class="{ 'is-disabled': isSendSms }"
            @click.prevent="sendSmsVerifyCode()"
          >
            {{ !countdown ? $t('发送验证码') : `${countdown ? `${countdown} ` : ''}${$t('后重新发送')}` }}
          </a>
        </div>
        <LangSelect class="login-lang-select" />
        <button class="btn small submit-btn" @click.prevent="smsLogin()">{{ $t('开始创建语言包') }}</button>
        <label class="flex agreement">
          <input v-model="form.agreement" type="checkbox" />
          {{ $t('我同意') }}
          <a href="" class="link-style">《{{ $t('注册协议') }}》</a>
          <a href="" class="link-style">《{{ $t('用户隐私政策') }}》</a>
        </label>
      </form>
    </div>
  </div>
  <Dialog v-model="visible">
    <div class="dialog-container">
      {{ $t('您同意') }} <a href="" class="link-style">《{{ $t('注册协议') }}》《{{ $t('用户隐私政策') }}》</a>？
      <div class="flex center">
        <button class="btn small" @click="aggAgreement()">{{ $t('同意') }}</button>
        <button class="btn small border" @click="visible = false">{{ $t('取消') }}</button>
      </div>
    </div>
  </Dialog>
</template>

<script>
import { defineComponent, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '../../utils'
import Dialog from '@/components/Dialog.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import i18n from '../../utils/i18n'

export default defineComponent({
  components: { Dialog, LangSelect },
  setup() {
    return {
      ...useLogin(),
      ...useProfile()
    }
  }
})

function useLogin() {
  const router = useRouter()
  const form = reactive({
    // phoneNumber: '17385723362',
    phoneNumber: '',
    verifyCode: '',
    agreement: false
  })
  const visible = ref(false)
  const countdown = ref(0)
  // Gitee 授权登录
  const giteeLogin = async () => {
    if (!form.agreement) {
      visible.value = true
      return
    }
    const result = await request.post('/login/gitee')
    if (result.code === 0) {
      location.href = result.data
    }
  }

  // 短信登录
  const smsLogin = async () => {
    if (!form.phoneNumber || !form.verifyCode) return
    if (!form.agreement) {
      visible.value = true
      return
    }
    const result = await request.post('/login/sms', form)
    if (result.code === 0) {
      // 保存 token
      localStorage.setItem('x-token', result.token)
      router.push('/new')
    }
  }

  const aggAgreement = () => {
    form.agreement = true
    visible.value = false
  }

  // 获取短信验证码
  let timer = 0
  let s = 30 // 30s
  const isSendSms = ref(false)
  const sendSmsVerifyCode = async () => {
    const { phoneNumber } = form
    if (s < 1 || !phoneNumber) return
    const result = await request.get('/login/sms/send', {
      params: { phoneNumber }
    })
    if (result.code === 0) {
      isSendSms.value = true
      timer = setInterval(() => {
        countdown.value = s
        s--
        if (s < 0) {
          s = 30
          isSendSms.value = false
          clearInterval(timer)
        }
      }, 1000)
    }
  }
  onUnmounted(() => {
    clearInterval(timer)
  })

  return {
    form,
    visible,
    smsLogin,
    countdown,
    giteeLogin,
    isSendSms,
    aggAgreement,
    sendSmsVerifyCode
  }
}

function useProfile() {
  const getProfile = async () => {
    const result = await request.get('/user/gitee')
    if (result && result.access_token) {
      localStorage.setItem('x-token', result.access_token)
    }
  }
  return {
    getProfile
  }
}
</script>

<style lang="less" scoped>
.login {
  position: relative;
  width: 100%;
  height: 100vh;
  display: grid;
  align-items: center;
  overflow: hidden;
  .input {
    letter-spacing: 2px;
    font-size: 18px;
  }
  .input::placeholder {
    font-size: 14px;
  }
}
.login-lang-select {
  margin-top: 40px;
}
.login-lang-select :deep(.input) {
  font-size: 18px;
}
.login-lang-select :deep(.select-options) {
  top: 48px;
}
.form-container {
  padding: 40px;
  margin: auto;
  border-radius: 6px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 15px fade(#000, 5);
  transition: box-shadow .3s;
  &:focus-within {
    box-shadow: 0 0 30px fade(#000, 10);
  }
  .guide {
    justify-content: center;
    margin-bottom: 40px;
  }
  .guide a:first-child {
    margin-right: 20px;
  }
  .guide a:last-child {
    margin-left: 20px;
  }
  .agreement {
    cursor: pointer;
    align-items: flex-start;
    input {
      margin-right: 3px;
    }
  }
}
.link-style {
  color: #6C63FF;
}
.flex {
  display: flex;
  align-items: center;
  &.center {
    justify-content: center;
  }
}
.dialog-container {
  padding: 20px 0;
  .flex {
    margin-top: 20px;
  }
}
.input-code {
  max-width: 450px;
  justify-content: space-between;
  margin: 0 auto;
  .input {
    max-width: 300px;
    margin: 0;
  }
  .code-btn {
    width: 150px;
    text-align: center;
    color: #6C63FF;
  }
  .code-btn.is-disabled {
    color: gray;
    cursor: not-allowed;
  }
}
.submit-btn {
  font-size: 18px;
  max-width: 450px;
  height: 42px;
  line-height: 42px;
  width: 100%;
  margin: 40px auto;
  display: block;
}

.login-bg {
  position: absolute;
  bottom: -10px;
  left: 0;
  z-index: -1;
  width: 100%;
}
.path-0 {
  animation:pathAnim-0 4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes pathAnim-0 {
  0%{
    d: path("M 0,600 C 0,600 0,200 0,200 C 82.88995215311004,184.04784688995215 165.7799043062201,168.09569377990428 260,191 C 354.2200956937799,213.90430622009572 459.77033492822954,275.665071770335 578,273 C 696.2296650717705,270.334928229665 827.1387559808612,203.24401913875596 917,176 C 1006.8612440191388,148.75598086124404 1055.6746411483255,161.35885167464116 1136,172 C 1216.3253588516745,182.64114832535884 1328.1626794258373,191.3205741626794 1440,200 C 1440,200 1440,600 1440,600 Z");
  }
  25%{
    d: path("M 0,600 C 0,600 0,200 0,200 C 89.34928229665073,201.244019138756 178.69856459330146,202.48803827751198 273,221 C 367.30143540669854,239.51196172248802 466.555023923445,275.2918660287081 565,270 C 663.444976076555,264.7081339712919 761.0813397129186,218.3444976076555 846,184 C 930.9186602870814,149.6555023923445 1003.1196172248804,127.33014354066987 1100,132 C 1196.8803827751196,136.66985645933013 1318.44019138756,168.33492822966508 1440,200 C 1440,200 1440,600 1440,600 Z");
  }
  50%{
    d: path("M 0,600 C 0,600 0,200 0,200 C 92.66985645933013,175.311004784689 185.33971291866027,150.622009569378 277,170 C 368.66028708133973,189.377990430622 459.3110047846891,252.822966507177 547,265 C 634.6889952153109,277.177033492823 719.4162679425838,238.08612440191388 828,230 C 936.5837320574162,221.91387559808612 1069.0239234449762,244.83253588516746 1175,245 C 1280.9760765550238,245.16746411483254 1360.4880382775118,222.58373205741628 1440,200 C 1440,200 1440,600 1440,600 Z");
  }
  75%{
    d: path("M 0,600 C 0,600 0,200 0,200 C 90.17224880382778,215.1004784688995 180.34449760765557,230.20095693779902 266,234 C 351.65550239234443,237.79904306220098 432.7942583732057,230.29665071770336 544,222 C 655.2057416267943,213.70334928229664 796.4784688995215,204.61244019138758 896,211 C 995.5215311004785,217.38755980861242 1053.2918660287082,239.25358851674642 1137,240 C 1220.7081339712918,240.74641148325358 1330.3540669856459,220.3732057416268 1440,200 C 1440,200 1440,600 1440,600 Z");
  }
  100%{
    d: path("M 0,600 C 0,600 0,200 0,200 C 82.88995215311004,184.04784688995215 165.7799043062201,168.09569377990428 260,191 C 354.2200956937799,213.90430622009572 459.77033492822954,275.665071770335 578,273 C 696.2296650717705,270.334928229665 827.1387559808612,203.24401913875596 917,176 C 1006.8612440191388,148.75598086124404 1055.6746411483255,161.35885167464116 1136,172 C 1216.3253588516745,182.64114832535884 1328.1626794258373,191.3205741626794 1440,200 C 1440,200 1440,600 1440,600 Z");
  }
}
.path-1 {
  animation:pathAnim-1 4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes pathAnim-1 {
  0%{
    d: path("M 0,600 C 0,600 0,400 0,400 C 103.02392344497608,397.98086124401914 206.04784688995215,395.9617224880382 294,386 C 381.95215311004785,376.0382775119618 454.83253588516754,358.1339712918661 559,364 C 663.1674641148325,369.8660287081339 798.622009569378,399.5023923444976 890,422 C 981.377990430622,444.4976076555024 1028.6794258373207,459.85645933014354 1113,455 C 1197.3205741626793,450.14354066985646 1318.6602870813397,425.07177033492826 1440,400 C 1440,400 1440,600 1440,600 Z");
  }
  25%{
    d: path("M 0,600 C 0,600 0,400 0,400 C 85.07177033492823,403.9425837320574 170.14354066985646,407.8851674641148 268,428 C 365.85645933014354,448.1148325358852 476.4976076555024,484.40191387559815 571,465 C 665.5023923444976,445.59808612440185 743.8660287081341,370.5071770334928 832,356 C 920.1339712918659,341.4928229665072 1018.0382775119617,387.5693779904306 1121,405 C 1223.9617224880383,422.4306220095694 1331.9808612440193,411.21531100478467 1440,400 C 1440,400 1440,600 1440,600 Z");
  }
  50%{
    d: path("M 0,600 C 0,600 0,400 0,400 C 113.45454545454547,421.57894736842104 226.90909090909093,443.15789473684214 327,438 C 427.09090909090907,432.84210526315786 513.8181818181818,400.94736842105254 589,396 C 664.1818181818182,391.05263157894746 727.8181818181819,413.0526315789474 829,423 C 930.1818181818181,432.9473684210526 1068.909090909091,430.8421052631579 1177,425 C 1285.090909090909,419.1578947368421 1362.5454545454545,409.57894736842104 1440,400 C 1440,400 1440,600 1440,600 Z");
  }
  75%{
    d: path("M 0,600 C 0,600 0,400 0,400 C 87.10047846889952,422.3732057416268 174.20095693779905,444.7464114832536 269,429 C 363.79904306220095,413.2535885167464 466.2966507177033,359.3875598086124 556,357 C 645.7033492822967,354.6124401913876 722.6124401913877,403.70334928229664 821,415 C 919.3875598086123,426.29665071770336 1039.2535885167463,399.7990430622009 1146,391 C 1252.7464114832537,382.2009569377991 1346.3732057416269,391.10047846889955 1440,400 C 1440,400 1440,600 1440,600 Z");
  }
  100%{
    d: path("M 0,600 C 0,600 0,400 0,400 C 103.02392344497608,397.98086124401914 206.04784688995215,395.9617224880382 294,386 C 381.95215311004785,376.0382775119618 454.83253588516754,358.1339712918661 559,364 C 663.1674641148325,369.8660287081339 798.622009569378,399.5023923444976 890,422 C 981.377990430622,444.4976076555024 1028.6794258373207,459.85645933014354 1113,455 C 1197.3205741626793,450.14354066985646 1318.6602870813397,425.07177033492826 1440,400 C 1440,400 1440,600 1440,600 Z");
  }
}
</style>

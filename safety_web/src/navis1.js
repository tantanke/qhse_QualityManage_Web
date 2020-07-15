import IconDashBoard from './assets/icons/dashboard.svg'
import IconSystem from './assets/icons/system.svg'
import IconConfig from './assets/icons/config.svg'
import IconAnalysis from './assets/icons/analysis.svg'
import IconPatrol from './assets/icons/patrol.svg'
import IconList from './assets/icons/list.svg'
import IconEventAndAccident from './assets/icons/EventAndAccident.svg'
import IconStudyCase from './assets/icons/StudyCase.svg'
// import IconList from './assets/icons/list.svg'//图标还需要修改
import {GetNaviByUserRole} from './services/navisBar'

export default{
    data () {
        return {
            loading: false
        }
    },
    methods: {
        GetModule () {
            alert("jin")
            this.loading = true
            GetNaviByUserRole({uName:'大队长'}).then((res) => {
                alert(JSON.stringify(res))
                this.loading = false
            }).catch((err) => {
                this.$message.error(err.message)
                this.loading = false
            })
        }
    },
    mounted () {
        this.GetModule()
    }
}
  
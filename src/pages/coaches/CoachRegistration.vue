<template>
    <div>
        <section>
            <base-card>
                <h2>Register as a coach now!</h2>
                <CoachFrom @save-data="saveData"></CoachFrom>
            </base-card>
        </section>
    </div>
</template>

<script>
import CoachFrom from "@/components/coaches/CoachForm"
export default {
    components: {
        CoachFrom
    },
    methods: {
        saveData(data) {
            this.$store.dispatch('coaches/registerCoach', data);
            // replace and push both are same the only different is with replace we can't go back to the page
            this.$router.replace('coaches');
        }
    }
}
</script>
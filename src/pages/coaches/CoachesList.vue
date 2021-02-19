<template>
    <div>
        <!-- double exclamation (!!) convert string a truthy value into a real thru boolean because :show need boolean value -->
        <base-dialog :show="!!error" title="An error occurred!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <coach-filter @change-filter="setFilters"></coach-filter>
        </section>
        <section>
            <base-card>
                <div class="controls">
                    <!--<base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>-->
                    <button class="outline" @click="loadCoaches(true)">Refresh</button>
                    <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">Login to Register as Coach</base-button>
                    <base-button v-if="isLoggedIn && !isCoach && !isLoading" link to="/register">Register as Coach</base-button>
                </div>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <ul v-else-if="hasCoaches">
                    <coach-item 
                        v-for="coach in filteredCoaches" :key="coach.id"
                        :id="coach.id"
                        :first-name="coach.firstName"
                        :last-name="coach.lastName"
                        :rate="coach.hourlyRate"
                        :areas="coach.areas"
                    ></coach-item>
                </ul>
                <h3 v-else>No Coaches Found!</h3>
            </base-card>
        </section>
    </div>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem.vue'
import CoachFilter from '@/components/coaches/CoachFilter'
export default {
    data() {
        return {
            isLoading: false,
            error: null,
            activeFilters: {
                frontend: true,
                backend: true,
                career: true
            }
        }
    },
    components: {
        CoachItem,
        CoachFilter
    },
    created() {
        this.loadCoaches()
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters.isAuthenticated;
        },
        filteredCoaches() {
            //coaches(namespace)/coaches(getter name)
            const coaches = this.$store.getters['coaches/coaches']
            return coaches.filter(coach => {
                if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
                    return true
                }
                if (this.activeFilters.backend && coach.areas.includes('backend')) {
                    return true
                }
                if (this.activeFilters.career && coach.areas.includes('career')) {
                    return true
                }
                return false
            });
        },
        hasCoaches() {
            return !this.isLoading && this.$store.getters['coaches/hasCoaches'];
        },
        isCoach() {
            return this.$store.getters['coaches/isCoach']
        }
    },
    methods: {
        setFilters(updatedFilters) {
            this.activeFilters = updatedFilters;
        },
        async loadCoaches(refresh = false) {
            this.isLoading = true;
            try{
                await this.$store.dispatch('coaches/loadCoaches', {forceRefresh: refresh})
            } catch (error) {
                this.error = error.message || 'Something went wrong!'
            }
            this.isLoading = false
        },
        handleError() {
            this.error = null;
        }
    }
}
</script>

<style scoped>
button {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  font: inherit;
  background-color: #3a0061;
  border: 1px solid #3a0061;
  color: white;
  cursor: pointer;
  border-radius: 30px;
  margin-right: 0.5rem;
  display: inline-block;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
.outline {
  background-color: transparent;
  border-color: #270041;
  color: #270041;
}
</style>
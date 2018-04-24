<template>
    <nav>
        <div class="nav-wrapper">
            <Filters />
        </div>
    </nav>
</template>

<script>
import Filters from '@/components/logs-viewer/Filters'

export default {
    name: 'NavBar',
    components: {
        Filters
    }
}
</script>

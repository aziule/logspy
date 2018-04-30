<template>
    <section>
        <Nav />
        <TabContent />
    </section>
</template>

<script>
import Nav from '@/components/Nav'
import TabContent from '@/components/TabContent'

export default {
    components: {
        Nav,
        TabContent
    },
    name: 'App'
}
</script>

<style>
select:focus {
    outline: none;
}
.error {
    padding: 15px;
    color: white;
    background-color: #f44336;
    margin-top: 15px;
}
select {
    position: relative!important;
    display: block!important;
    opacity: 1!important;
    color: black!important;
    width: auto!important;
    height: 3rem!important;
    font-weight: normal!important;
    pointer-events: auto!important;
}
</style>

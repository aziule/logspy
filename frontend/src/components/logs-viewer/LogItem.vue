<template>
    <tr>
        <td>{{ log.id }}</td>
        <td>{{ log.time|date }}</td>
        <td>{{ log.level }}</td>
        <td>{{ log.message ? log.message : log.raw }}</td>
        <td><pre>{{ log.contextual_info }}</pre></td>
    </tr>
</template>

<script>
export default {
    name: 'LogItem',
    props: ['log'],
    filters: {
        date: (date) => {
            return new Date(date).toLocaleString()
        }
    }
}
</script>

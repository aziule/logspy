<template>
    <div v-bind:class="{'file-selector-wrapper': isVisible, 'file-selector-wrapper--hidden': !isVisible}">
        <div class="file-selector__overlay"></div>
        <div class="row">
            <div class="file-selector col s6 offset-s3">
                <h1>Choose a file</h1>
                <div class="row">
                    <div class="col s12">
                        <ul class="tabs">
                            <li class="tab" v-bind:class="{ active: activeTab === 'local' }" @click="selectTab('local')">Local file</li>
                            <li class="tab" v-bind:class="{ active: activeTab === 'remote' }" @click="selectTab('remote')">Remote file</li>
                        </ul>
                    </div>
                    <div class="col s12">
                        <div class="error" v-if="error">{{ error }}</div>
                        <tab-local-file v-if="activeTab == 'local'" v-on:onError="onError" v-on:onLogFileOpened="onLogFileOpened"/>
                        <tab-remote-file v-if="activeTab == 'remote'" v-on:onError="onError" v-on:onLogFileOpened="onLogFileOpened"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TabLocalFile from '@/components/file-selector/TabLocalFile'
import TabRemoteFile from '@/components/file-selector/TabRemoteFile'

export default {
    name: 'FileSelector',
    data: () => {
        return {
            activeTab: 'local',
            isVisible: true,
            error: null
        }
    },
    methods: {
        selectTab (name) {
            this.activeTab = name
        },
        onLogFileOpened () {
            this.error = null
            this.isVisible = false
        },
        onError (e) {
            this.error = e.message
        }
    },
    components: {
        TabLocalFile,
        TabRemoteFile
    }
}
</script>

<style scoped>
h1 {
    font-size: 2rem;
    text-align: center;
}
.tabs {
    text-align: center;
}
.tabs > .tab {
    transition: .2s;
    cursor: pointer;
    color: #ee6e73;
    opacity: .7;
    padding: 15px;
    height: auto;
    line-height: 1rem;
    margin-left: 15px;
    margin-right: 15px;
}
.tabs > .tab:hover,
.tabs > .tab.active {
    opacity: 1;
}
.tabs > .tab.active {
    border-bottom: 2px solid #ee6e73;
}
.file-selector-wrapper {
    transition: opacity .2s, visibility .2s;
    visibility: visible;
    opacity: 1;
}
.file-selector-wrapper--hidden {
    transition: opacity .2s, visibility .2s;
    opacity: 0;
    visibility: hidden;
}
.file-selector {
    background-color: white;
    padding: 15px;
    border-radius: 3px;
}
.file-selector__overlay {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .2);
    z-index: -1;
}
</style>

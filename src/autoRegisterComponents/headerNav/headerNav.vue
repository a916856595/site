<template>
    <div class="head-nav-box">
        <div class="header-nav">
            <ul class="w menu-list">
                <li>
                    <i
                        class="el-icon-menu"
                        @click="openNavMenu"
                    />
                </li>
                <li
                    index="/login"
                    class="fr"
                >
                    <div :class="['search-area', 'background-gray', isSearchAreaActive ? 'active' : '']">
                        <input
                            @focus="focusSearchArea"
                            @blur="blurSearchArea"
                            @keyup.enter="onSearch"
                            v-model="searchValue"
                            type="text"
                            placeholder="搜索文章"
                        />
                        <i
                            class="el-icon-search"
                            @click="onSearch"
                        />
                    </div>
                    <el-button
                        size="small"
                        @click="goArticleEdit"
                        type="primary"
                        class="article-edit-button"
                    >
                        写文章
                    </el-button>
                    <el-button
                        v-if="!userInfo"
                        type="text"
                        @click="login"
                    >
                        登录/注册
                    </el-button>
                    <el-popover
                        v-else
                        popper-class="button-popper"
                        :value="isShowMenu"
                    >
                        <div
                            class="avatar-container"
                            slot="reference"
                        >
                            <img
                                :src="userInfo.avatar"
                                :alt="userInfo.userName"
                                @click.stop="changeMenuShowState(true)"
                            />
                        </div>
                        <div
                            class="user-hover-button-box"
                            v-click-other-element="changeMenuShowState"
                        >
                            <el-button
                                class="popper-button"
                                size="small"
                                @click="goPersonCenter"
                            >
                                个人中心
                            </el-button>
                            <el-button
                                class="popper-button"
                                size="small"
                                @click="logout"
                            >
                                退出登录
                            </el-button>
                        </div>
                    </el-popover>
                </li>
            </ul>
        </div>
        <login :visible="isShowLoginWindow" />
        <el-drawer
            :visible.sync="isShowNav"
            :with-header="false"
            direction="ltr"
        >
            <ul class="nav-menu-list">
                <li @click="linkToRouter('root')">
                    <i class="el-icon-s-home" />
                    <span>首页</span>
                </li>
                <li @click="linkToRouter('setting')">
                    <i class="el-icon-s-tools" />
                    <span>设置</span>
<!--                    <router-link to="/setting">设置</router-link>-->
                </li>
            </ul>
        </el-drawer>
    </div>
</template>

<script>
    import { stateNameSpace, commitNameSpace } from '@nameSpace/storeNameSpace';
    import storageNameSpace from '@nameSpace/storageNameSpace';
    import { clearLocalToken } from '@libs/tokenUtil';
    import clickOtherElement from '../../directives/clickOtherElement';

    export default {
        name: 'header-nav',
        directives: {
            clickOtherElement
        },
        data() {
            return {
                searchValue: '',
                isSearchAreaActive: false,
                isShowMenu: false,              // 是否展示个人菜单
                isShowNav: false,               // 是否展示导航菜单
            }
        },
        methods: {
            // 展开导航菜单
            openNavMenu() {
                this.isShowNav = true;
            },
            // 变更菜单显示状态
            changeMenuShowState(isShow, event) {
                this.isShowMenu = !!isShow;
            },
            // 搜索框获取焦点
            focusSearchArea() {
                this.isSearchAreaActive = true;
            },
            // 搜索框失去焦点
            blurSearchArea() {
                this.isSearchAreaActive = false;
            },
            // 登录
            login() {
                const instance = this;
                this.$store.commit(commitNameSpace.toggleShowLoginWindow, {
                    visible: true,
                    onSuccess() { instance.tryGetUserInfoFromLocalStorage(); },
                    onFail() { console.log('login fail') } 
                });
            },
            // 登出
            logout() {
                // 清除登录相关信息
                localStorage.removeItem(storageNameSpace.userInfo);
                localStorage.removeItem(storageNameSpace.token);
                this.$store.commit(commitNameSpace.saveUserInfo, null);
                // 返回首页
                this.$router.push({ name: 'root' });
                this.changeMenuShowState();
            },
            tryGetUserInfoFromLocalStorage() {
                const localUserInfo = localStorage.getItem(storageNameSpace.userInfo);
                const token = localStorage.getItem(storageNameSpace.token);
                const tokenExpireTime = localStorage.getItem(storageNameSpace.tokenExpireTime);
                const currentTime = Date.now();
                const tokenIsCorrect = !!(token && tokenExpireTime && (currentTime < tokenExpireTime));
                try {
                    const userInfo = JSON.parse(localUserInfo);
                    if (tokenIsCorrect && userInfo) {
                        // 正确获取有效用户信息
                        this.$store.commit(commitNameSpace.saveUserInfo, userInfo);
                    } else if (tokenIsCorrect && !userInfo) {
                        // 没有用户信息
                        this.$store.commit(commitNameSpace.saveUserInfo, null);
                    } else {
                        // 用户信息失效
                        if (token || tokenExpireTime || localUserInfo) {
                            this.message.info({
                                title: '提示',
                                message: '用户信息失效，请重新登录'
                            });
                        }
                        clearLocalToken();
                        if (this.$route.name !== 'root') this.$router.push({ name: 'root' });
                    }
                } catch (err) {

                };
            },
            // 搜索框搜索
            onSearch() {
                // 仅当有值才执行搜索操作
                if (this.searchValue) {
                    // 变更值并确认后更新store中的搜索值以触发搜索
                    this.$store.commit(commitNameSpace.updateSearchKeyWord, this.searchValue);
                    if (this.$route.path !== '/search') {
                        this.$router.push({
                            path: '/search',
                            query: {
                                keyword: this.searchValue
                            }
                        });
                    }
                }
            },
            // 判断是否登录后跳转到文章编辑页面
            goArticleEdit () {
                const articleEditRouteName = 'articleEdit';
                if (this.$route.name === articleEditRouteName) return;
                if (this.userInfo) this.$router.push({ name: articleEditRouteName });
                else this.login();
            },
            // 跳转到个人中心页面
            goPersonCenter () {
                this.changeMenuShowState();
                const personCenterDetailRouteName = 'personCenterDetail';
                if (this.$route.name === personCenterDetailRouteName) return;
                this.$router.push({
                    name: personCenterDetailRouteName,
                    query: {
                        account: this.userInfo.account
                    }
                });
            },
            // 跳转到指定路由
            linkToRouter(routerName) {
                this.isShowNav = false;
                if (this.$route.name === routerName) return;
                this.$router.push({ name: routerName });
            }
        },
        mounted() {
            this.tryGetUserInfoFromLocalStorage();
            // 页面刷新时如果读取到了关键字，则更新显示内容
            if (this.searchKeyWord) this.searchValue = this.searchKeyWord;
        },
        computed: {
            isShowLoginWindow () {
                return this.$store.state.isShowLoginWindow;
            },
            userInfo () {
                return this.$store.state[stateNameSpace.userInfo];
            },
            searchKeyWord () {
                return this.$store.state[stateNameSpace.searchKeyWord];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header-nav {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        background: #FFF;
        z-index: 9;
        .menu-list {
            height: 100%;
            li {
                float: left;
                line-height: 60px;
                padding: 0 10px;
                height: 100%;
                &:last-child {
                    display: flex;
                    align-items: center;
                    .avatar-container {
                        width: 32px;
                        height: 32px;
                        box-sizing: border-box;
                        overflow: hidden;
                        border-radius: 2px;
                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
        .w {
            padding: 0;
        }
        .search-area {
            display: flex;
            height: 32px;
            padding: 0 10px;
            border-radius: 16px;
            border: 1px solid #e6e6e6;
            transition: .3s border-color;
            margin-right: 15px;
            &.active {
                border-color: $main-color;
            }
            > input, i {
                line-height: 30px;
            }
            input {
                border: none;
                outline: none;
                background: none;
                width: 160px;
                padding-left: 10px;
                @media screen and (max-width: 400px) {
                    width: 80px;
                }
            }
            i {
                display: inline-block;
                cursor: pointer;
                flex: 1;
                text-align: center;
                &:hover {
                    color: $main-color;
                }
            }
        }
        .article-edit-button {
            margin-right: 10px;
        }
    }
    .button-popper {
        padding: 0;
        .user-hover-button-box {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            .popper-button {
                width: 100%;
                margin: 0;
                border: none;
            }
        }
    }
</style>

<style lang="scss">
    .nav-menu-list {
        > li {
            padding-left: 20px;
            border-bottom: 1px solid #DDD;
            cursor: pointer;
            i, span {
                line-height: 60px;
            }
            i {
                display: inline-block;
                margin-right: 8px;
            }
        }
    }
</style>
<template>
    <div class="search-page">
        <div class="w">
            <div
                class="article-list"
                ref="listComponent"
                v-if="articleList && articleList.length"
            >
                <ul class="list-wrapper">
                    <li v-for="article in articleList"
                        :key="article.id">
                        <div class="top">
                            <p class="one-line-text title"
                               @click="viewArticleDetail(article)">{{article.title}}</p>
                            <span>{{article.updateTime | dayTime}}</span>
                        </div>
                        <div class="bottom">
                            <span>{{article.author}}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <empty
                v-else
                tip="没有相关信息"
            />
        </div>
    </div>
</template>

<script>
    import { search } from '@request';
    import { stateNameSpace, commitNameSpace } from '@nameSpace/storeNameSpace';

    export default {
        name: 'search-page',
        data() {
            return {
                keyword: '',    // 搜索关键字
                articleList: '' // 搜索文章结果
            }
        },
        methods: {
            search (searchValue) {
                const requestParams = {
                    keyword: searchValue || this.keyword
                };
                search(requestParams)
                    .then(result => {
                        const { content } = result;
                        if (content) this.articleList = content;
                    })
            },
            viewArticleDetail(article) {
                const {id} = article;
                this.$router.push({
                    name: 'articleDetail',
                    params: {id}
                });
            },
        },
        created () {
            const { keyword } = this.$route.query;
            if (keyword !== undefined) {
                this.keyword = keyword;
                return this.$store.commit(commitNameSpace.updateSearchKeyWord, keyword);
                this.search();
            }
        },
        computed: {
            searchKeyWord () {
                return this.$store.state[stateNameSpace.searchKeyWord];
            }
        },
        watch: {
            searchKeyWord (searchValue) {
                this.search(searchValue);
            }
        }
    }
</script>

<style scoped lang="scss">
    .article-list {
        overflow: auto;

        .list-wrapper {
            > li {
                padding: 15px 0;
                border-bottom: 1px solid rgba(0, 0, 0, .05);

                .top {
                    display: flex;

                    .title {
                        cursor: pointer;
                    }

                    p {
                        flex: 1;
                    }

                    > span {
                        display: inline-block;
                        width: 150px;
                        text-align: right;
                    }
                }

                .bottom {
                    text-align: right;
                }
            }
        }
    }
</style>
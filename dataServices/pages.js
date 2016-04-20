
"use strict";

var Page = require('../models').Page;
var SubPage = require('../models').SubPage;
var PagePost = require('../models').PagePost;
var PagePostSubelement = require('../models').PagePostSubelement;

var Errors = require('../utils').Errors;

let exists = require('./utils').exists;

function getSubPage(pageId,subPageId) {
    return new Promise( function (resolve,reject) {
        SubPage.where({'id':subPageId,'page_id':pageId}).fetch().then(function(subPage) {
            if (subPage) {
                return resolve(subPage); //.toJSON());
            } else {
               return reject(new Errors.NotFoundError('No sub page found with the specified id'));
            }

        }).catch(function(err) {
            return reject(err);
        });
    });
}

function getSubPages(communityId,pageId,offset,limit) {
   offset = offset || 0;
   limit = limit || 10;
   return new Promise( function (resolve,reject) {
        Page.where({'id':pageId,'community_id':communityId}).fetch().then(function(page) {
            if (page) {
                page.subPagesSorted(offset,limit).then(function(subPages) {
                    return resolve(subPages);
                }).catch(function(err) {
                    return reject(err);
                });
            } else {
               return reject(new Errors.NotFoundError('No page found with the specified id'));
            }

        }).catch(function(err) {
            return reject(err);
        });
    });
}



module.exports = {

    list(communityId,offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            Page.collection().query(function(q){q.where('community_id', '=', communityId).orderBy("page_type_id", "asc").offset(offset).limit(limit)}).fetch().then(function(pages) {
                return resolve(pages.toJSON());
            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    get(communityId,pageId) {
        return new Promise( function (resolve,reject) {
            Page.where({'id':pageId,'community_id':communityId}).fetch().then(function(page) {
                if (page) {
                    return resolve(page.toJSON());
                } else {
                   return reject(new Errors.NotFoundError('No page found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },

    subPages(communityId,pageId,offset,limit) {
        return getSubPages(communityId,pageId,offset,limit)
        /*
       offset = offset || 0;
       limit = limit || 10;
       return new Promise( function (resolve,reject) {
            Page.where({'id':pageId,'community_id':communityId}).fetch().then(function(page) {
                if (page) {
                    page.subPagesSorted(offset,limit).then(function(subPages) {
                        return resolve(subPages);
                    }).catch(function(err) {
                        return reject(err);
                    });
                } else {
                   return reject(new Errors.NotFoundError('No page found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
*/
    },

    getSubPage(communityId,pageId,subPageId) {
       let getPage = this.get;
       return new Promise( function (resolve,reject) {
          getPage(communityId,pageId).then(function(page) {
             getSubPage(pageId,subPageId).then(function(subPage) {
                return resolve(subPage.toJSON());
             }).catch( err => reject(err));
          }).catch( err => reject(err));
        });
    },

    subPagePosts(communityId,pageId,subPageId,offset,limit) {

       let getPage = this.get;

       offset = offset || 0;
       limit = limit || 10;
       return new Promise( function (resolve,reject) {
          getPage(communityId,pageId).then(function(page) {
             getSubPage(pageId,subPageId).then(function(subPage) {
                subPage.pagePostsSorted(offset,limit).then(function(posts) {
                    return resolve(posts);
                }).catch(function(err) {
                    return reject(err);
                });
             }).catch( err => reject(err));
          }).catch( err => reject(err));
        });
    },

    posts(communityId,pageId,offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {

        Page.where({'id':pageId,'community_id':communityId}).fetch().then(function(page) {
            if (page) {
                page.pagePostsSorted(offset,limit).then(function(posts) {
                    return resolve(posts);
                }).catch(function(err) {
                    return reject(err);
                });
            } else {
               return reject(new Errors.NotFoundError('No page found with the specified id'));
            }

        }).catch(function(err) {
            return reject(err);
        });

/*
            getSubPages(communityId,pageId,offset,limit).then(function(subPages) {
                subPages.forEach(function(subPage) {
                    console.log('sub page: ' + subPage);
                    console.log('sub page posts: ' + subPage.pagePosts);
                });
               return resolve(subPages);
            }).catch( err => reject(err));
*/

            /*
            PagePost.collection().query(function(q){
                q.where({'community_id':communityId,}'community_id', '=', communityId)
                .orderBy("id", "asc").offset(offset).limit(limit)}).fetch().then(function(posts) {
                return resolve(posts.toJSON());
            }).catch(function(err) {
                return reject(err);
            });
*/
        });
    },

    getPagePost(communityId,pageId,pagePostId) {

        let getPage = this.get;


        console.log('IN GET PAGE POST');

/*
new Site({id:1})
  .authors()
  .query({where: {id: 2}})
  .fetchOne()
  .then(function(model) {
    // ...
  });
*/


/*
            Page.forge({'id':pageId,'community_id':communityId}).then(function(row) {
                console.log('exists? ' + exists);
            }).catch(function(err) {
               console.log('ERROR: ' + err);
            });

        DSUtils.exists(Page,{'id':pageId,'community_id':communityId}).then(function(exists) {
            console.log('exists? ' + exists);
        }).catch(err => console.log(err));
*/

       
/*
var p = exists(Page,{'id':pageId,'community_id':communityId});
var p2 = exists(Page,{'id':pageId,'community_id':communityId});

Promise.all([p,p2]).then(function(values) { 
  console.log('RESOLVED: ' + values); // [3, 1337, "foo"] 
}).catch(err => console.log(err));
*/

       return new Promise( function (resolve,reject) {

          exists(Page,{'id':pageId,'community_id':communityId}).then(function(doesExist) {
             if (doesExist) {
                PagePost.where({'id':pagePostId}).fetch().then(function(pagePost) {
                    if (pagePost) {
                        return resolve(pagePost); //.toJSON());
                    } else {
                       return reject(new Errors.NotFoundError('No page post found with the specified id'));
                    }

                }).catch(function(err) {
                    return reject(err);
                });
             } else {
                return reject(new Errors.NotFoundError('No page found with the specified id'));
             }
          }).catch(function(err) {
             return reject(err);
          });

        /*
          getPage(communityId,pageId).then(function(page) {
             //
             // This only executes if the page was valid and it was in the specified community.
             //
            PagePost.where({'id':pagePostId}).fetch().then(function(pagePost) {
                if (pagePost) {
                    return resolve(pagePost); //.toJSON());
                } else {
                   return reject(new Errors.NotFoundError('No page post found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });

          }).catch( err => reject(err));
*/

        });

            /*
            PagePost.where({'id':subPageId,'page_id':pageId}).fetch().then(function(subPage) {
                if (subPage) {
                    return resolve(subPage); //.toJSON());
                } else {
                   return reject(new Errors.NotFoundError('No sub page found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
*/
      
    },

    getPagePostSubposts(communityId,pageId,pagePostId) {

        // 1. does the page exist in the community?
        // 2. does the page post exist in the page?


       return new Promise( function (resolve,reject) {

            //
            // Get the page that matches the id and community. If this returns nothing, then the id is incorrect.
            //
            var fetchPage = Page.where({'id':pageId,'community_id':communityId}).fetch();

            //
            // Get the page post. If this returns nothing, then the id isn't correct.
            //
            var fetchPagePost = PagePost.where({'id':pagePostId}).fetch();

            Promise.all([fetchPage,fetchPagePost]).then(function(values) { 
                let page = values[0];
                let pagePost = values[1];
                if (page && pagePost) {
                    let subPageId = pagePost.get('sub_page_id');

                    PagePostSubelement.where({'page_post_id':pagePostId}).fetch().then(function(subPosts) {
                        if (subPosts) {
                            return resolve(subPosts); //.toJSON());
                        } else {
                            return resolve([]); //reject(new Errors.NotFoundError('No page post found with the specified id'));
                        }

                    }).catch(function(err) {
                        return reject(err);
                    });


                    //return resolve({foo:'bar' + subPageId})
                } else {
                    return reject(new Errors.NotFoundError('No page post found with the specified id'));
                }
            }).catch(function(err) {
                return reject(err);
            });

        /*
            var pageExists = exists(Page,{'id':pageId,'community_id':communityId});
            var pagePostExists = exists(PagePost,{'id':pagePostId,'page_id':pageId});

            Promise.all([pageExists,pagePostExists]).then(function(values) { 
               var allDoExist = a.reduce(function(acc,v) {
                  return acc && v;
               },true);
               if (allDoExist) {
                   return resolve('foo');
                    PagePostSubelement.where({'page_post_id':pagePostId}).fetch().then(function(subPosts) {
                        if (subPosts) {
                            return resolve(subPosts); //.toJSON());
                        } else {
                           return reject(new Errors.NotFoundError('No page post found with the specified id'));
                        }

                    }).catch(function(err) {
                        return reject(err);
                    });

               } else {
                  return reject(new Errors.NotFoundError('No post found with the specified id'));
               }
            }).catch(function(err) {
                return reject(err);
            });
*/

       });


    },

    messages(userId,communityId,offset,limit) {
        offset = offset || 0;
        limit = limit || 10;
        return new Promise( function (resolve,reject) {
            User.where('user_id', userId).fetch().then(function(user) {
                if (user) {
                    user.messagesInCommunity(communityId,offset,limit).then(function(messages) {
                        return resolve(messages);
                    }).catch(function(err) {
                        return reject(err);
                    });
                } else {
                   return reject(new Errors.NotFoundError('No user found with the specified id'));
                }

            }).catch(function(err) {
                return reject(err);
            });
        });
    },

   

}
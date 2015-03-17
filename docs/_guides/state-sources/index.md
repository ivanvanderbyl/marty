---
layout: page
title: State Sources
id: state-sources
section: State Sources
---

State sources are how you get state into and out of your application. State can come from many different places (e.g. API's, Web sockets, Local Storage), State sources encapsulate a lot of complexities in connecting to these sources and provides a uniform, easy to test interface for the rest of your application to use.

{% highlight js %}
var UserAPI = Marty.createStateSource({
  type: 'http',
  baseUrl: 'http://foo.com',
  getUsers: function () {
    return this.get('/users').then(function (res) {
      SourceActionCreators.receiveUsers(res.body);
    });
  },
  createUser: function (user) {
    return this.post('/users', { body: user });
  }
});

UserAPI.getUsers();
{% endhighlight %}

Marty comes with a number of state sources out of the box:

* [HTTP]({% url /guides/state-sources/http.html %})
* [JSON storage]({% url /guides/state-sources/json-storage.html %})
* [Local storage]({% url /guides/state-sources/local-storage.html %})
* [Session storage]({% url /guides/state-sources/session-storage.html %})

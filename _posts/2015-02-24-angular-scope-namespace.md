---
title: Simple Angular scope namespacing
layout: post
theme: theme-angular
---

The best way to work with controller scopes in Angular is to avoid using the `$scope` object as much as possible. Instead you should use the `controllerAs` syntax introduced in Angular 1.2.

If for some reason you can't use it, here’s a simple pattern that will help you handle and namespace your models.

At its core, this is how a basic controller using the pattern looks like:

{% highlight javascript %}
app.controller('MainCtrl', function($scope) {
  var model = $scope.model = {};

  model.fullName = '';
  model.age = 30;
});
{% endhighlight %}

You’ll notice the most important part at the top:

{% highlight javascript %}
  var model = $scope.model = {};
{% endhighlight %}

What this is doing is using a big object that will contain all the models in our controller. This helps with a couple of things.

First, it helps with the [“there’s gotta be a dot in there somewhere”](http://jimhoskins.com/2012/12/14/nested-scopes-in-angularjs.html) guideline for `ng-model`. 

And second, it gives you some syntactic sugar for referencing the models. After you set the `model` variable this way in your controller, you won’t need to reference `$scope` again, neither in the templates or in the rest of the controller (except for `$watch` or other `$scope` methods).

That means you can now use `model.modelName` in the controller and in the templates, for pointing to a model.

{% highlight javascript %}
// in controllers
model.modelName = 'abc';
{% endhighlight %}

{% highlight html %}
<!-- in templates -->
<input ng-model="model.modelName">
{% endhighlight %}

The pattern’s benefits are more obvious when using it with nested controllers.

Let’s say you want a couple of global models to use throughout the app. You can use the run block for defining the global models.

{% highlight javascript %}
app.run(function($rootScope) {
  var root = $rootScope.root = {};

  root.userId = 'abc';
});

app.controller('MainCtrl', function($scope) {
  var root = $scope.root;
  var model = $scope.model = {};

  model.fullName = '';
  model.age = 30;
});
{% endhighlight %}

For namespacing, I used a different variable name(`root`) for the model in the run block. 

You can now reference any model in the `root` namespace by using `root.modelName` in both the controller and the template.

Use the same pattern for any number of parent scopes, just make sure to use different namespaces for each parent.

When you want to share the same model namespace with a parent controller, you can use a slightly modified version of the `model` definition.

{% highlight javascript %}
$scope.model = $scope.model || {};
var model = $scope.model;
{% endhighlight %}

This will either inherit `model` from a top controller scope, if it exists, or define it as an empty object. This means you can use it as a standard route controller, or as a nested controller that shares the `model` namespace with its parent.

Even if you do use this pattern, keep in mind that the best practice is to to use services for models shared between controllers.


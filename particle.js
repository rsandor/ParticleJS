/*
 * particle.js
 * By Ryan Sandor Richards
 * Copyright 2010 MIT License
 */
var ParticleJS = function() {
  function Emitter() {
    /*
     * List of particles the emitter handles.
     */
    var particles = [];
    
    /*
     * Default Emitter Options
     */
    var options = {
        maxParticles: 100
      , position: [0, 0]
      , spawnRate: 0.1
      , lifespan: [10, 100]
      , xVelocity: [-1, 1]
      , yVelocity: [-1, 1]
      , updateEmitter: function() {
      }
      , drawParticle: function(g) {
        g.strokeStyle = "#FFF";
        g.beginPath();
        g.arc(this.x, this.y, 10, 0, Math.PI*2, false);
    		g.stroke();
        g.closePath();
      }
      , initParticle: function() {
      }
      , updateParticle: function() {
      }
    };
    
    function Particle() {
      this.x = this.y = 0;
    
      if (options.position.length >= 2) {
        this.x = options.position[0];
        this.y = options.position[1];
      }
    
      if (options.position[2]) {
        this.x += (2*Math.random()-1)*options.position[2];
        this.y += (2*Math.random()-1)*options.position[2];
      }
    
      if (typeof(options.xVelocity) == "object") {
        this.dx = (options.xVelocity[1] - options.xVelocity[0])*Math.random() + options.xVelocity[0];
      }
      else {
        this.dx = options.xVelocity;
      }
    
      if (typeof(options.yVelocity) == "object") {
        this.dy = (options.yVelocity[1] - options.yVelocity[0])*Math.random() + options.yVelocity[0];
      }
      else {
        this.dy = options.yVelocity;
      }
  
      if (typeof(options.lifespan) == "object") {
        this.life = parseInt(options.lifespan[0]+Math.random()*(options.lifespan[1]-options.lifespan[0]));
      }
      else {
        this.life = options.lifespan;
      }
      
      this.draw = options.drawParticle;
      
      options.initParticle.apply(this);
    }
  
    Particle.prototype.update = function() {
      this.x += this.dx;
      this.y += this.dy;
      this.life--;
      options.updateParticle.apply(this);
    }
    
    this.Particle = Particle;
  
    this.setOptions = function(opts) {
      if (opts && typeof(opts) == "object") {
        for (var k in options)
          if (opts[k])
            options[k] = opts[k];
      }
    };
    
    this.update = function() {
      var live = [];
      for (var i=0; i < particles.length; i++) {
        particles[i].update();
        if (particles[i].life > 0) {
          live.push(particles[i]);
        }
      }

      particles = live;

      if (particles.length < options.maxParticles && Math.random() < options.spawnRate) {
        particles.push(new Particle());
      }
      
      options.updateEmitter.apply(this);
    }

    this.draw = function(g) {
      for (var i = 0; i < particles.length; i++)
        particles[i].draw(g);
    }

    this.setOptions(arguments[0]);
  };
  
  var emitters = {};
  
  return {
      Emitter: Emitter
    
    , addEmitter: function(name, obj) {
      if (obj instanceof Emitter)
        emitters[name] = obj;
      else if (typeof obj == "object")
        emitters[name] = new Emitter(obj);
    }
    
    , removeEmitter: function(name) {
      delete emitters[name];
    }
    
    , update: function() {
      for (var k in emitters)
        emitters[k].update();
    }
    
    , draw: function(g) {
      for (var k in emitters) {
        emitters[k].draw(g);
      }
    }
  };
}();

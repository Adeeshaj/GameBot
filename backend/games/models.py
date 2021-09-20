from django.db import models
from datetime import datetime    


class Game(models.Model):
    name = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published', default=datetime.now)

    def __str__(self):
        return self.name


class Bot(models.Model):
    game = models.ForeignKey(Game, related_name='bots', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    bot_model = models.CharField(max_length=200)
    version = models.IntegerField(default=0)
    pub_date = models.DateTimeField('date published', default=datetime.now)

    def __str__(self):
        return self.name

    def update_model(self):
        return self.model
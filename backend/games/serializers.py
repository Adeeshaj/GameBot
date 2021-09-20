from rest_framework import serializers

from .models import Game, Bot


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id','name']
    
class BotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bot
        fields = ['id','name', 'bot_model', 'version']

class GameBotSerializer(serializers.Serializer):
    new_bot = serializers.PrimaryKeyRelatedField(queryset=Bot.objects.all())


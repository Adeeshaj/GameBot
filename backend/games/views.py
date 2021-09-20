from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Game, Bot
from .serializers import GameSerializer, GameBotSerializer, BotSerializer
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ViewSet, ModelViewSet
from rest_framework.decorators import action
from rest_framework.renderers import JSONRenderer
from rest_framework import status



class GameViewSet(ModelViewSet):
    """
    A viewset for viewing and editing game instances.
    """
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def list(self, request):
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)

    @action(
        detail=False,
        url_name='bots',
        methods=['get'],
        url_path='(?P<pk>[^/.]+)/bots'
    )
    def manage_bots(self, request, pk=None):
        game = get_object_or_404(Game, pk=pk)
        serializer = BotSerializer(game.bots.all(), many=True)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)

    
    @action(
        detail=False,
        url_name='bots',
        methods=['get', 'put'],
        url_path='(?P<pk>[^/.]+)/bots/(?P<subkey>[^/.]+)'
    )
    def manage_bot(self, request, pk=None, subkey=None):
        game = get_object_or_404(Game, pk=pk)
        bot = get_object_or_404(game.bots, pk=subkey)

        if request.method == 'PUT':
            serializer = BotSerializer(bot, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)
        if request.method == 'GET':
            serializer = BotSerializer(bot)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)


 

    





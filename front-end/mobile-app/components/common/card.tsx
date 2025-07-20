import React from 'react';
import { View, Text, Image } from 'react-native';

interface CardProps {
  title: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({ title, imageUrl }) => {
  return (
    <View className="bg-white rounded-lg p-2 m-1 items-center shadow-md w-40">
      <Image source={{ uri: imageUrl }} className="w-36 h-36 rounded-md mb-2" />
      <Text className="text-base font-bold text-center">{title}</Text>
    </View>
  );
};

const CardList: React.FC = () => {
  const cardsData = [
    { id: '1', title: 'Card 1', imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Card1' },
    { id: '2', title: 'Card 2', imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Card2' },
    { id: '3', title: 'Card 3', imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Card3' },
    { id: '4', title: 'Card 4', imageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=Card4' },
    { id: '5', title: 'Card 5', imageUrl: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Card5' },
    { id: '6', title: 'Card 6', imageUrl: 'https://via.placeholder.com/150/00FFFF/000000?text=Card6' },
    { id: '7', title: 'Card 7', imageUrl: 'https://via.placeholder.com/150/800000/FFFFFF?text=Card7' },
    { id: '8', title: 'Card 8', imageUrl: 'https://via.placeholder.com/150/008000/FFFFFF?text=Card8' },
  ];

  return (
    <View className="flex-row flex-wrap justify-center p-2">
      {cardsData.map((card) => (
        <Card key={card.id} title={card.title} imageUrl={card.imageUrl} />
      ))}
    </View>
  );
};

export { Card, CardList };
import React from 'react';
import { faLocationDot, faTrain, faPeopleGroup, faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const TravelFeatures = () => {
  const features = [
    { icon: faTrain, text: 'Шукайті цікаві вам рейси' },
    { icon: faLocationDot, text: 'Подорожуйте по Україні різними напрямками' },
    { icon: faPeopleGroup, text: 'Приєднуйтесь до тисяч людей, які користуються нашими послугами' },
    { icon: faRobot, text: 'Зкористуйтеся нашим чат-ботом для автоматичного підбору найкращого для вас рейсу' },
  ];

  return (
    <div className="travel-features">
      {features.map((feature, index) => (
        <div key={index} className="feature">
          <FontAwesomeIcon icon={feature.icon} size='xl'/>
          <br/>
          <span>{feature.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TravelFeatures;
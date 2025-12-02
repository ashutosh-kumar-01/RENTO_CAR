import mongoose from 'mongoose';
import 'dotenv/config';
import Car from './models/Car.js';
import User from './models/User.js';
import Booking from './models/Booking.js';
import connectDB from './configs/db.js';
import bcrypt from 'bcrypt';

const seedData = async () => {
    try {
        await connectDB();
        console.log('Database connected');

        // Clear existing data
        await Car.deleteMany({});
        await User.deleteMany({});
        await Booking.deleteMany({});
        console.log('Cleared existing data');

        // Create a demo owner
        const hashedPassword = await bcrypt.hash('password123', 10);
        const owner = await User.create({
            name: 'Demo Owner',
            email: 'owner@example.com',
            password: hashedPassword,
            role: 'owner',
            phone: '9876543210'
        });
        console.log('Owner created');

        // Car Models with verified images
        const carModels = [
            {
                model: 'Swift',
                brand: 'Maruti Suzuki',
                category: 'Hatchback',
                pricePerDay: 1200,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Swift_LXi.jpg',
                transmission: 'Manual',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'A compact and fuel-efficient hatchback perfect for city driving.'
            },
            {
                model: 'Baleno',
                brand: 'Maruti Suzuki',
                category: 'Hatchback',
                pricePerDay: 1400,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2022_Maruti_Suzuki_Baleno_Alpha_(India)_front_view.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'A premium hatchback with advanced features and spacious interiors.'
            },
            {
                model: 'Dzire',
                brand: 'Maruti Suzuki',
                category: 'Sedan',
                pricePerDay: 1500,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Swift_Dzire_sedan.jpg',
                transmission: 'Manual',
                fuel_type: 'Diesel',
                seating_capacity: 5,
                year: 2022,
                description: 'India’s favorite compact sedan, offering great mileage and comfort.'
            },
            {
                model: 'Wagon R',
                brand: 'Maruti Suzuki',
                category: 'Hatchback',
                pricePerDay: 1100,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2019_Suzuki_Karimun_Wagon_R_GS,_West_Surabaya.jpg',
                transmission: 'Manual',
                fuel_type: 'CNG',
                seating_capacity: 5,
                year: 2021,
                description: 'The tall-boy hatchback known for its practicality and space.'
            },
            {
                model: 'Alto 800',
                brand: 'Maruti Suzuki',
                category: 'Hatchback',
                pricePerDay: 900,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_-_Alto_800_LXi.JPG',
                transmission: 'Manual',
                fuel_type: 'Petrol',
                seating_capacity: 4,
                year: 2020,
                description: 'The perfect budget car for city commutes.'
            },
            {
                model: 'Ertiga',
                brand: 'Maruti Suzuki',
                category: 'MPV',
                pricePerDay: 2200,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Ertiga(2).jpg',
                transmission: 'Automatic',
                fuel_type: 'CNG',
                seating_capacity: 7,
                year: 2023,
                description: 'A spacious MPV designed for large families.'
            },
            {
                model: 'Brezza',
                brand: 'Maruti Suzuki',
                category: 'SUV',
                pricePerDay: 1800,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2022_Maruti_Suzuki_Brezza_ZXi%2B_(India)_front_view_04.png',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'A compact SUV with bold looks and modern tech.'
            },
            {
                model: 'Nexon',
                brand: 'Tata',
                category: 'SUV',
                pricePerDay: 1600,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Tata_Nexon_XZA%2B_front_view.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'A stylish and safe compact SUV with premium features.'
            },
            {
                model: 'Harrier',
                brand: 'Tata',
                category: 'SUV',
                pricePerDay: 2100,
                image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
                transmission: 'Manual',
                fuel_type: 'Diesel',
                seating_capacity: 5,
                year: 2022,
                description: 'A stunning SUV with Land Rover pedigree and robust build.'
            },
            {
                model: 'Safari',
                brand: 'Tata',
                category: 'SUV',
                pricePerDay: 2400,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tata_Safari_Storme_(front),_Denpasar.jpg',
                transmission: 'Automatic',
                fuel_type: 'Diesel',
                seating_capacity: 7,
                year: 2023,
                description: 'The iconic 7-seater SUV for family adventures.'
            },
            {
                model: 'Tiago',
                brand: 'Tata',
                category: 'Hatchback',
                pricePerDay: 1200,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2022_Tata_Tiago_XZA%2B_front_20230512.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'A sporty hatchback with 4-star safety rating.'
            },
            {
                model: 'Altroz',
                brand: 'Tata',
                category: 'Hatchback',
                pricePerDay: 1400,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tata_Altroz_fronte.jpg',
                transmission: 'Manual',
                fuel_type: 'Diesel',
                seating_capacity: 5,
                year: 2023,
                description: 'India’s safest hatchback with gold standard design.'
            },
            {
                model: 'Punch',
                brand: 'Tata',
                category: 'SUV',
                pricePerDay: 1300,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2021_Tata_Punch_Creative_(India)_front_view_01.png',
                transmission: 'Manual',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'The micro SUV that packs a punch.'
            },
            {
                model: 'Thar',
                brand: 'Mahindra',
                category: 'SUV',
                pricePerDay: 2500,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Thar_LX_Hard_Top_Diesel_MT_finished_in_Napoli_Black.jpg',
                transmission: 'Manual',
                fuel_type: 'Diesel',
                seating_capacity: 4,
                year: 2023,
                description: 'The ultimate off-road vehicle for adventure enthusiasts.'
            },
            {
                model: 'XUV700',
                brand: 'Mahindra',
                category: 'SUV',
                pricePerDay: 2800,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2021_Mahindra_XUV700_2.2_AX7_(India)_front_view.png',
                transmission: 'Automatic',
                fuel_type: 'Diesel',
                seating_capacity: 7,
                year: 2023,
                description: 'A tech-loaded SUV with advanced safety and performance.'
            },
            {
                model: 'Scorpio N',
                brand: 'Mahindra',
                category: 'SUV',
                pricePerDay: 2300,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Scorpio_N_1662098067527.jpg',
                transmission: 'Manual',
                fuel_type: 'Diesel',
                seating_capacity: 7,
                year: 2023,
                description: 'The Big Daddy of SUVs with commanding road presence.'
            },
            {
                model: 'Bolero',
                brand: 'Mahindra',
                category: 'SUV',
                pricePerDay: 1800,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Bolero_ZLX.jpg',
                transmission: 'Manual',
                fuel_type: 'Diesel',
                seating_capacity: 7,
                year: 2021,
                description: 'The rugged workhorse of India.'
            },
            {
                model: 'XUV300',
                brand: 'Mahindra',
                category: 'SUV',
                pricePerDay: 1700,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_XUV300.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'A compact SUV with best-in-class torque and safety.'
            },
            {
                model: 'City',
                brand: 'Honda',
                category: 'Sedan',
                pricePerDay: 1800,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Honda_City_2020.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'A premium sedan offering comfort and class-leading space.'
            },
            {
                model: 'Amaze',
                brand: 'Honda',
                category: 'Sedan',
                pricePerDay: 1400,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Honda_Amaze_front_view.jpg',
                transmission: 'Automatic',
                fuel_type: 'Diesel',
                seating_capacity: 5,
                year: 2021,
                description: 'A compact sedan with big space and efficiency.'
            },
            {
                model: 'Fortuner',
                brand: 'Toyota',
                category: 'SUV',
                pricePerDay: 3500,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Fortuner_India.jpg',
                transmission: 'Automatic',
                fuel_type: 'Diesel',
                seating_capacity: 7,
                year: 2023,
                description: 'A powerful full-size SUV built for all terrains.'
            },
            {
                model: 'Innova Crysta',
                brand: 'Toyota',
                category: 'MPV',
                pricePerDay: 2600,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg',
                transmission: 'Manual',
                fuel_type: 'Diesel',
                seating_capacity: 7,
                year: 2022,
                description: 'The most comfortable and reliable MPV for long journeys.'
            },
            {
                model: 'Creta',
                brand: 'Hyundai',
                category: 'SUV',
                pricePerDay: 1700,
                image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'The ultimate SUV with premium features and comfort.'
            },
            {
                model: 'Venue',
                brand: 'Hyundai',
                category: 'SUV',
                pricePerDay: 1500,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hyundai_Venue_1.6_GLS_2021.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'A connected SUV designed for the urban jungle.'
            },
            {
                model: 'i20',
                brand: 'Hyundai',
                category: 'Hatchback',
                pricePerDay: 1400,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hyundai_i20_(BC3)_1X7A6488.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'The premium hatchback with sporty styling.'
            },
            {
                model: 'Seltos',
                brand: 'Kia',
                category: 'SUV',
                pricePerDay: 1700,
                image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3df?auto=format&fit=crop&w=800&q=80',
                transmission: 'Manual',
                fuel_type: 'Diesel',
                seating_capacity: 5,
                year: 2023,
                description: 'A badass SUV with aggressive styling and tech.'
            },
            {
                model: 'Sonet',
                brand: 'Kia',
                category: 'SUV',
                pricePerDay: 1500,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kia_Sonet_front_view_(India)_01.png',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'A wild compact SUV with premium interiors.'
            },
            {
                model: 'Kwid',
                brand: 'Renault',
                category: 'Hatchback',
                pricePerDay: 1000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Renault_Kwid_2017_in_Montevideo_(front).jpg',
                transmission: 'Manual',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2021,
                description: 'SUV-inspired hatchback for the city.'
            },
            {
                model: 'Triber',
                brand: 'Renault',
                category: 'MPV',
                pricePerDay: 1300,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Renault_Triber_(front_view).png',
                transmission: 'Manual',
                fuel_type: 'Petrol',
                seating_capacity: 7,
                year: 2022,
                description: 'A super spacious and modular 7-seater.'
            },
            {
                model: 'Kiger',
                brand: 'Renault',
                category: 'SUV',
                pricePerDay: 1400,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2021_Renault_Kiger_RXZ_(India)_front_view.png',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'A sporty compact SUV with a stunning design.'
            },
            {
                model: 'Kushaq',
                brand: 'Skoda',
                category: 'SUV',
                pricePerDay: 1900,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Skoda_Kushaq_Front.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'German engineering tailored for India.'
            },
            {
                model: 'Virtus',
                brand: 'Volkswagen',
                category: 'Sedan',
                pricePerDay: 2000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Volkswagen_Virtus_Topline_front_20230520.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'A premium sedan with exhilarating performance.'
            },
            {
                model: 'Taigun',
                brand: 'Volkswagen',
                category: 'SUV',
                pricePerDay: 2000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2021_Volkswagen_Taigun_1.5_TSI_GT_(India)_front_view_02.png',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'A dynamic SUV built for the enthusiast.'
            },
            {
                model: 'Hector',
                brand: 'MG',
                category: 'SUV',
                pricePerDay: 2200,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/MG(Morris_Garages)_Hector_SUV_in_Jamshedpur,_Jharkhand,_India_(Ank_Kumar,_Infosys_Limited))_01.jpg',
                transmission: 'Automatic',
                fuel_type: 'Diesel',
                seating_capacity: 5,
                year: 2023,
                description: 'India’s first internet SUV with panoramic sunroof.'
            },
            {
                model: 'Magnite',
                brand: 'Nissan',
                category: 'SUV',
                pricePerDay: 1400,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Magnite_01.jpg',
                transmission: 'Manual',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'A big, bold, and beautiful compact SUV.'
            },
            {
                model: 'Compass',
                brand: 'Jeep',
                category: 'SUV',
                pricePerDay: 2800,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jeep-compass-2018-petrol-at-limited-india-front.jpg',
                transmission: 'Automatic',
                fuel_type: 'Diesel',
                seating_capacity: 5,
                year: 2022,
                description: 'A premium SUV with legendary Jeep 4x4 capability.'
            },
            {
                model: '3 Series',
                brand: 'BMW',
                category: 'Luxury',
                pricePerDay: 5000,
                image: 'https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&w=800&q=80',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'The ultimate driving machine with luxury and performance.'
            },
            {
                model: 'A4',
                brand: 'Audi',
                category: 'Luxury',
                pricePerDay: 4800,
                image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
                transmission: 'Automatic',
                fuel_type: 'Diesel',
                seating_capacity: 5,
                year: 2023,
                description: 'A perfect blend of technology, comfort, and style.'
            },
            {
                model: 'C-Class',
                brand: 'Mercedes',
                category: 'Luxury',
                pricePerDay: 5500,
                image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'Experience the best or nothing with this luxury sedan.'
            },
            // Sports Cars
            {
                model: 'Mustang',
                brand: 'Ford',
                category: 'Sports',
                pricePerDay: 8000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ford_Mustang_VII_Convertible_Autofrühling_Ulm_IMG_9339.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 4,
                year: 2023,
                description: 'The iconic American muscle car.'
            },
            {
                model: '911 Carrera',
                brand: 'Porsche',
                category: 'Sports',
                pricePerDay: 12000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Porsche_911_Carrera_Stratstone.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 2,
                year: 2023,
                description: 'The quintessential sports car.'
            },
            {
                model: 'Huracan',
                brand: 'Lamborghini',
                category: 'Sports',
                pricePerDay: 25000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lamborghini_Huracán_Tecnica_1X7A7430.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 2,
                year: 2023,
                description: 'A masterpiece of performance and design.'
            },
            {
                model: 'Roma',
                brand: 'Ferrari',
                category: 'Sports',
                pricePerDay: 22000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ferrari_Roma_Spider_IMG_9546.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 2,
                year: 2023,
                description: 'La Nuova Dolce Vita.'
            },
            {
                model: 'R8',
                brand: 'Audi',
                category: 'Sports',
                pricePerDay: 15000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Audi_R8_V10_RWS_MYLE_Festival_2025_DSC_9492.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 2,
                year: 2023,
                description: 'Born on the track, built for the road.'
            },
            {
                model: 'F-Type',
                brand: 'Jaguar',
                category: 'Sports',
                pricePerDay: 10000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jaguar_F-Type_ZP_Edition,_Auto_2024,_Zurich_(PANA0387).jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 2,
                year: 2023,
                description: 'Pulse-quickening performance.'
            },
            {
                model: 'AMG GT',
                brand: 'Mercedes-Benz',
                category: 'Sports',
                pricePerDay: 14000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-AMG_GT_63_S_(Facelift)_1X7A7353.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 2,
                year: 2023,
                description: 'Handcrafted by racers.'
            },
            {
                model: 'M4',
                brand: 'BMW',
                category: 'Sports',
                pricePerDay: 9000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/BMW_M4_in_der_BMW_Welt.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 4,
                year: 2023,
                description: 'Power, precision, and adrenaline.'
            },
            {
                model: 'GT-R',
                brand: 'Nissan',
                category: 'Sports',
                pricePerDay: 11000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_V-spec,_BAS_24,_Brussels_(P1170369-RR).jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 4,
                year: 2023,
                description: 'The ultimate everyday supercar.'
            },
            {
                model: 'Corvette',
                brand: 'Chevrolet',
                category: 'Sports',
                pricePerDay: 13000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chevrolet_Corvette_C8_IAA_2021_1X7A0156.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 2,
                year: 2023,
                description: 'Precision. Power. Performance.'
            },
            // More Regular Cars
            {
                model: 'Ciaz',
                brand: 'Maruti Suzuki',
                category: 'Sedan',
                pricePerDay: 1600,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Ciaz_2017.jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'Elegant sedan for a comfortable ride.'
            },
            {
                model: 'Ignis',
                brand: 'Maruti Suzuki',
                category: 'Hatchback',
                pricePerDay: 1100,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Ignis_in_India.jpg',
                transmission: 'Manual',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2021,
                description: 'Compact urban SUV.'
            },
            {
                model: 'Jazz',
                brand: 'Honda',
                category: 'Hatchback',
                pricePerDay: 1300,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2019_Honda_Jazz_1.5_S_(1).jpg',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'Spacious and versatile hatchback.'
            },
            {
                model: 'Verna',
                brand: 'Hyundai',
                category: 'Sedan',
                pricePerDay: 1700,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2020_Hyundai_Verna_SX(O)_1.5_Diesel_front_view_(India).png',
                transmission: 'Automatic',
                fuel_type: 'Diesel',
                seating_capacity: 5,
                year: 2023,
                description: 'Futuristic sedan with powerful performance.'
            },
            {
                model: 'Aura',
                brand: 'Hyundai',
                category: 'Sedan',
                pricePerDay: 1300,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2020_Hyundai_Aura_Front.png',
                transmission: 'Manual',
                fuel_type: 'CNG',
                seating_capacity: 5,
                year: 2022,
                description: 'Modern compact sedan.'
            },
            {
                model: 'Carens',
                brand: 'Kia',
                category: 'MPV',
                pricePerDay: 1800,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2022_Kia_Carens_1.4_(India)_front_view_01.jpg',
                transmission: 'Automatic',
                fuel_type: 'Diesel',
                seating_capacity: 7,
                year: 2023,
                description: 'Recreational vehicle for the modern family.'
            },
            {
                model: 'Astor',
                brand: 'MG',
                category: 'SUV',
                pricePerDay: 1900,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2021_MG_Astor_Sharp_220_Turbo_(India)_front_view.png',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'The AI inside SUV.'
            },
            {
                model: 'Duster',
                brand: 'Renault',
                category: 'SUV',
                pricePerDay: 1600,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Renault_Duster_Techroad,_Natal_(DSC05979).jpg',
                transmission: 'Manual',
                fuel_type: 'Diesel',
                seating_capacity: 5,
                year: 2021,
                description: 'True SUV capability.'
            },
            {
                model: 'Polo GT',
                brand: 'Volkswagen',
                category: 'Hatchback',
                pricePerDay: 1500,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2020_Volkswagen_Polo_GT_TSI_(India)_front_view.png',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'The legendary hot hatch.'
            },
            {
                model: 'i20 N Line',
                brand: 'Hyundai',
                category: 'Hatchback',
                pricePerDay: 1600,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2021_Hyundai_i20_N_Line_(BI3;_India)_front_view.png',
                transmission: 'Automatic',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2023,
                description: 'Inspired by the race track.'
            },
            {
                model: 'WR-V',
                brand: 'Honda',
                category: 'SUV',
                pricePerDay: 1500,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Honda_WR-V_Z+_(DG5)_front.jpg',
                transmission: 'Manual',
                fuel_type: 'Petrol',
                seating_capacity: 5,
                year: 2022,
                description: 'Bold and sporty crossover.'
            },
            {
                model: 'Urban Cruiser Hyryder',
                brand: 'Toyota',
                category: 'SUV',
                pricePerDay: 2000,
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2022_Toyota_Urban_Cruiser_Hyryder_V_Hybrid_(India)_front_view.jpg',
                transmission: 'Automatic',
                fuel_type: 'Hybrid',
                seating_capacity: 5,
                year: 2023,
                description: 'The self-charging hybrid SUV.'
            }
        ];

        const cars = [];
        // Create one entry for each unique model to ensure uniqueness
        for (let i = 0; i < carModels.length; i++) {
            const carModel = carModels[i];
            cars.push({
                ...carModel,
                owner: owner._id,
                location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'][Math.floor(Math.random() * 5)],
                isAvailable: true
            });
        }

        await Car.insertMany(cars);
        console.log(`${cars.length} Cars seeded successfully`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

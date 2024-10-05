export interface AttributesPlanetProps {
    birthday: Date;
    planet: string;
    color: string;
    size: 'Small' | 'Medium' | 'Large';
    surface: 'Mountain 1' | 'Mountain 2' | 'Mountain 3' | 'Rough 1' | 'Rough 2' | 'Rough 3' | 'Coarse 1' | 'Coarse 2' | 'Coarse 3';
    cloud: 'None' | 'Low' | 'High';
    rings: 'None' | '1 Rings' | 'X Rings' | 'Aura';
    code: string;
};
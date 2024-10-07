import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { FetchOwnPlanet, FetchOtherPlanet } from '@/metaplex/planet';

const usePlanetData = () => {
    const wallet = useWallet();
    const [ ownPlanetData, setOwnPlanetData ] = useState<any[]>([]);
    const [ otherPlanetData, setOtherPlanetData ] = useState<any[]>([]);
    const [ isLoadingOwn, setIsLoadingOwn ] = useState(true);
    const [ isLoadingOther, setIsLoadingOther ] = useState(true);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ cooldown, setCooldown ] = useState(0);

    const sortPlanets = useCallback((data: any[]) => {
        return data.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            const [ textA, numberA ] = nameA.split('#');
            const [ textB, numberB ] = nameB.split('#');
            const textComparison = textA.localeCompare(textB);
            
            if (textComparison === 0) {
                return parseInt(numberB) - parseInt(numberA);
            }
            
            return textComparison;
        });
    }, []);

    const fetchOwnPlanets = useCallback(async () => {
        if (!wallet.publicKey) return;
        setIsLoadingOwn(true);
        setErrorMessage('');
        try {
            const ownPlanet = await FetchOwnPlanet(wallet.publicKey.toString());
            setOwnPlanetData(sortPlanets(ownPlanet));
        } catch (error) {
            setErrorMessage(error as string);
        } finally {
            setIsLoadingOwn(false);
        }
    }, [wallet.publicKey, sortPlanets]);

    const fetchOtherPlanets = useCallback(async () => {
        setIsLoadingOther(true);
        setErrorMessage('');
        try {
            const otherPlanet = await FetchOtherPlanet();
            setOtherPlanetData(sortPlanets(otherPlanet));
        } catch (error) {
            setErrorMessage(error as string);
        } finally {
            setIsLoadingOther(false);
        }
    }, [sortPlanets]);

    const refreshOwnData = useCallback(() => {
        if (cooldown === 0) {
            setCooldown(10);
            fetchOwnPlanets();
        }
    }, [cooldown, fetchOwnPlanets]);

    const refreshOtherData = useCallback(() => {
        if (cooldown === 0) {
            setCooldown(10);
            fetchOtherPlanets();
        }
    }, [cooldown, fetchOtherPlanets]);

    useEffect(() => {
        fetchOwnPlanets();
        fetchOtherPlanets();
    }, [fetchOwnPlanets, fetchOtherPlanets]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [cooldown]);

    return {
        ownPlanetData,
        otherPlanetData,
        isLoadingOwn,
        isLoadingOther,
        errorMessage,
        cooldown,
        refreshOwnData,
        refreshOtherData
    };
};

export default usePlanetData;
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const useToken = () => {
	const router = useRouter();

	useEffect(() => {
		const authToken = localStorage.getItem('token');

		if (!authToken) {
			router.push('/login')
		}
		return () => {
			// cleanup
		};
	}, [router]);
}

export default useToken;

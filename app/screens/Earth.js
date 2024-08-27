import React, { useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import * as THREE from 'three';
import { PanGestureHandler } from 'react-native-gesture-handler';

const Earth = () => {
    const earthRef = useRef(null);
    const lastTouch = useRef({ x: 0, y: 0 });
    const [loading, setLoading] = useState(true);

    const handleContextCreate = (gl) => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);

        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

        const textureURL = 'https://www.wallpaperflare.com/static/457/259/824/earth-map-world-wallpaper-preview.jpg';
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(textureURL, () => {
            setLoading(false); // Hide loader when texture is loaded
        }, undefined, (error) => {
            console.error('Error loading texture:', error);
        });

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const earth = new THREE.Mesh(geometry, material);
        earthRef.current = earth;
        scene.add(earth);

        camera.position.z = 3;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();
    };

    const handleGesture = (event) => {
        if (!earthRef.current) return;

        const { translationX, translationY } = event.nativeEvent;
        const { x, y } = lastTouch.current;

        const deltaX = translationX - x;
        const deltaY = translationY - y;

        lastTouch.current = { x: translationX, y: translationY };

        const earth = earthRef.current;
        earth.rotation.y += deltaX * 0.01; // Invert the direction for correct movement
        earth.rotation.x += deltaY * 0.01; // Invert the direction for correct movement
    };

    const handleGestureStateChange = (event) => {
        if (event.nativeEvent.state === 5) { // GestureHandlerState.END
            lastTouch.current = { x: 0, y: 0 };
        }
    };

    return (
        <View style={styles.container}>
            {loading && <ActivityIndicator size="large" color="#fff" style={styles.loader} />}
            <PanGestureHandler
                onGestureEvent={handleGesture}
                onHandlerStateChange={handleGestureStateChange}
            >
                <GLView style={styles.glView} onContextCreate={handleContextCreate} />
            </PanGestureHandler>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#550816',
    },
    glView: {
        flex: 1,
    },
    loader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Earth;

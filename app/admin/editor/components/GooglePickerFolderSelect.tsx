"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Folder, HardDrive, Loader2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EditorFormData } from "../types";

interface GooglePickerFolderSelectProps {
    formData: EditorFormData;
    updateField: <K extends keyof EditorFormData>(field: K, value: EditorFormData[K]) => void;
}

declare global {
    interface Window {
        google: any;
        gapi: any;
    }
}

export function GooglePickerFolderSelect({ formData, updateField }: GooglePickerFolderSelectProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [pickerReady, setPickerReady] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Load the Google Picker API
        const loadGooglePicker = () => {
            const script1 = document.createElement('script');
            script1.src = 'https://apis.google.com/js/api.js';
            script1.async = true;
            script1.defer = true;
            script1.onload = () => {
                window.gapi.load('picker', () => {
                    setPickerReady(true);
                });
            };
            document.body.appendChild(script1);
        };

        if (!window.gapi) {
            loadGooglePicker();
        } else {
            window.gapi.load('picker', () => {
                setPickerReady(true);
            });
        }
    }, []);

    const openPicker = async () => {
        if (!pickerReady) {
            alert('Google Picker is still loading. Please try again in a moment.');
            return;
        }

        setIsLoading(true);

        try {
            // Get the access token from the session
            const tokenResponse = await fetch('/api/drive/token');
            if (!tokenResponse.ok) {
                throw new Error('Failed to get access token. Please sign in with Google.');
            }

            const { accessToken } = await tokenResponse.json();

            // Create and show the picker
            const picker = new window.google.picker.PickerBuilder()
                .addView(
                    new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS)
                        .setSelectFolderEnabled(true)
                        .setMimeTypes('application/vnd.google-apps.folder')
                )
                .setOAuthToken(accessToken)
                .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '')
                .setCallback(pickerCallback)
                .setTitle('Select Destination Folder')
                .build();

            picker.setVisible(true);
        } catch (error: any) {
            console.error('Error opening picker:', error);
            alert(error.message || 'Failed to open folder picker. Please make sure you are signed in with Google.');
        } finally {
            setIsLoading(false);
        }
    };

    const pickerCallback = (data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
            const folder = data.docs[0];
            updateField('driveFolderId', folder.id);
            updateField('driveFolderName', folder.name);
            updateField('driveFolderUrl', folder.url);
        }
    };

    const clearFolder = () => {
        updateField('driveFolderId', "");
        updateField('driveFolderName', "");
        updateField('driveFolderUrl', "");
    };

    return (
        <div className="space-y-3">
            <div className="flex items-start justify-between">
                <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Google Drive Storage</Label>
                        <Tooltip>
                            <TooltipTrigger
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Info className="w-4 h-4" />
                            </TooltipTrigger>
                            {showTooltip && (
                                <TooltipContent>
                                    <p className="leading-relaxed">
                                        By default, a new folder will be automatically created in your Google Drive for this form.
                                        If you want to save files to a specific existing folder, you can select one using the button below.
                                    </p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </div>
                    {formData.driveFolderName ? (
                        <p className="text-sm text-muted-foreground">Files will be saved to your selected folder.</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">A new folder will be created automatically for this form.</p>
                    )}
                </div>

                {formData.driveFolderName ? (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-md border border-green-100">
                            <Folder className="w-4 h-4" />
                            <span className="font-medium truncate max-w-[150px]">{formData.driveFolderName}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openPicker}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            Change
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFolder}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Clear
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openPicker}
                        className="gap-2"
                        disabled={isLoading || !pickerReady}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                <HardDrive className="w-4 h-4" />
                                Choose Custom Folder (Optional)
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

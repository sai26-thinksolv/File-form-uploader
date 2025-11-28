import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Calendar, Users } from "lucide-react";
import { EditorFormData } from "../types";

interface AccessTabProps {
    formData: EditorFormData;
    updateField: <K extends keyof EditorFormData>(field: K, value: EditorFormData[K]) => void;
}

export function AccessTab({ formData, updateField }: AccessTabProps) {
    return (
        <Card className="shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
            <CardHeader>
                <CardTitle className="text-lg">Availability & Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Link Expiry Section - Always Visible */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-sm">Link Expiry</Label>
                        <p className="text-sm text-muted-foreground">Auto-close form after date.</p>
                    </div>
                    <Switch
                        checked={!!formData.expiryDate}
                        onCheckedChange={(c) => updateField('expiryDate', c ? new Date().toISOString().slice(0, 16) : null)}
                        className="data-[state=checked]:bg-indigo-600"
                    />
                </div>

                {formData.expiryDate && (
                    <div className="pl-4 border-l-2 border-indigo-100 flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            <Input
                                type="datetime-local"
                                value={formData.expiryDate.slice(0, 16)}
                                onChange={(e) => updateField('expiryDate', e.target.value)}
                                className="w-full sm:w-auto"
                            />
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-100"></div>

                {/* Access Level Section */}
                <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700">Who can respond?</Label>
                    <RadioGroup
                        value={formData.accessLevel}
                        onValueChange={(val) => updateField('accessLevel', val as "ANYONE" | "INVITED")}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className={`relative flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.accessLevel === 'ANYONE' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <RadioGroupItem value="ANYONE" id="anyone" className="mt-1" />
                            <div className="space-y-1">
                                <Label htmlFor="anyone" className="font-medium cursor-pointer">Public</Label>
                                <p className="text-xs text-muted-foreground">Anyone with the link</p>
                            </div>
                        </div>
                        <div className={`relative flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.accessLevel === 'INVITED' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <RadioGroupItem value="INVITED" id="invited" className="mt-1" />
                            <div className="space-y-1">
                                <Label htmlFor="invited" className="font-medium cursor-pointer">Restricted</Label>
                                <p className="text-xs text-muted-foreground">Invited people only</p>
                            </div>
                        </div>
                    </RadioGroup>

                    {formData.accessLevel === 'INVITED' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            <Label className="text-sm font-medium text-gray-700">Email Invitations</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter email addresses (comma separated)"
                                    value={formData.allowedEmails}
                                    onChange={(e) => updateField('allowedEmails', e.target.value)}
                                />
                                <Button size="icon" variant="outline">
                                    <Mail className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Only these email addresses will be able to access the form.</p>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Email Field Control Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm">Collect Email Addresses</Label>
                            <p className="text-sm text-muted-foreground">Ask uploaders for their email.</p>
                        </div>
                        <div className="w-[180px]">
                            <Select
                                value={formData.emailFieldControl || "OPTIONAL"}
                                onValueChange={(val) => updateField('emailFieldControl', val as "REQUIRED" | "OPTIONAL" | "NOT_INCLUDED")}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="REQUIRED">Required</SelectItem>
                                    <SelectItem value="OPTIONAL">Optional</SelectItem>
                                    <SelectItem value="NOT_INCLUDED">Don't Ask</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

            </CardContent >
        </Card >
    );
}

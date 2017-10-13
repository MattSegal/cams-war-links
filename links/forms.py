from collections import OrderedDict

from django import forms


class FormBase(forms.Form):
    def __init__(self, *args, **kwargs):
        super(FormBase, self).__init__(*args, **kwargs)
        self.fields = OrderedDict(
            (k, self.fields[k]) for k in self.fields_key_order
        )

class ConfirmBase(FormBase):
    password_confirm = forms.CharField(
        label="Confirm Password",
        label_suffix="",
        max_length=30, 
        required=True,
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Confirm password',
        })
    )

    def clean(self):
        cleaned_data = super(ConfirmBase, self).clean()

        password = self.cleaned_data.get('password')
        password_confirm = self.cleaned_data.get('password_confirm')

        if password and password_confirm:
            if password != password_confirm:
                raise forms.ValidationError("Passwords don't match")

        return self.cleaned_data


class LoginForm(FormBase):
    name = 'Login'
    fields_key_order = ('username', 'password',)

    username = forms.CharField(
        label="Username",
        label_suffix="",
        max_length=20,
        required=True,
        widget=forms.TextInput(attrs={
            'name': 'username',
            'placeholder': 'Username',
        }),
    )
    password = forms.CharField(
        label="Password",
        label_suffix="",
        max_length=30, 
        required=True,
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Password',
        })
    )



class SignupForm(LoginForm, ConfirmBase):
    name = 'Sign Up'
    fields_key_order = ('username', 'password', 'password_confirm',)


class ChangePasswordForm(ConfirmBase):
    name = 'Change Password'
    fields_key_order = ('password', 'password_confirm',)

    password = forms.CharField(
        label="Password",
        label_suffix="",
        max_length=30, 
        required=True,
        widget=forms.PasswordInput(attrs={
            'placeholder': 'New password',
        })
    )
